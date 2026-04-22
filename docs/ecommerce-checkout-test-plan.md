# E-commerce checkout — test plan

This document defines **manual and automated coverage** for a typical checkout flow: cart, discounts, payment, confirmation, and notifications. Each case has an ID for traceability to automated suites (`pytest` / Vitest).

## Scope

- **In scope:** Cart mutations, promo codes, tax/shipping totals (simplified), payment intent / token handling, order persistence, confirmation UI, transactional email triggers, concurrency and limits, input validation, injection resistance, PCI-aligned handling of card data.
- **Out of scope (unless integrated later):** PSP-specific UIs (Stripe Elements, etc.); carrier rate shopping; full fraud scoring.

## Test data strategy

| Concern | Approach |
|--------|-----------|
| **Identifiers** | UUID v4 for `user_id`, `session_id`, `cart_id`; monotonically increasing or ULID for `order_id` in tests that assert ordering. |
| **Products** | Factory: `{ sku, price_cents, stock, max_per_order, taxable }`. Use fixed seeds for reproducibility; use `hypothesis` or property-style generators for boundary prices (0, 1, max int). |
| **Discounts** | table-driven cases: `percent`, `fixed_cents`, `free_shipping`, `stackable` vs `exclusive`, `min_subtotal_cents`, `expires_at`, `usage_limit_global`, `usage_limit_per_user`. |
| **Payments** | **Never** commit real PAN/CVV. Use PSP test tokens (e.g. `tok_visa`), mock gateway responses: `success`, `insufficient_funds`, `expired_card`, `incorrect_cvc`, `processing_error`, `idempotency_replay`. |
| **PII / email** | Disposable domains in lower environments; assert mailer payloads with fixed fixtures; redact logs in assertions. |
| **Concurrency** | Two sessions same `user_id` or same `cart_id`; parallel `POST /checkout` with same idempotency key. |
| **Cleanup** | Transaction rollback or dedicated test DB schema per worker; truncate `orders`, `order_items`, `carts`, `discount_redemptions` between pytest modules if not transactional. |

**Environments:** `local` (mocks), `staging` (test PSP mode), `prod` (read-only monitors only).

---

## Positive test cases (successful paths)

| ID | Title | Preconditions | Steps | Expected |
|----|--------|----------------|-------|----------|
| POS-01 | Add single in-stock item to empty cart | Product stock ≥ 1 | Add line qty 1 | Cart has 1 line; subtotal = unit price × qty |
| POS-02 | Add multiple distinct SKUs | All in stock | Add A then B | Two lines; quantities independent |
| POS-03 | Increment quantity on existing line | Line exists, stock allows | Increase qty | Line qty and subtotal update; inventory reserved or decremented per rules |
| POS-04 | Apply valid percentage discount | Subtotal meets minimum | Enter code `SAVE10` | Discount applied; grand total reduced correctly |
| POS-05 | Apply valid fixed-amount discount | Subtotal > discount | Enter code `FLAT500` | `min(subtotal, 500)` discount in cents |
| POS-06 | Stackable discount with free shipping | Policy allows stack | Apply `SAVE10` then `FREESHIP` | Both apply; shipping becomes 0 if rule matches |
| POS-07 | Payment succeeds with valid token | Gateway in test mode | Submit checkout with `tok_visa` | `200`; order `paid`; payment id stored |
| POS-08 | Order confirmation page | Payment succeeded | Navigate to `/orders/{id}/confirmation` | Order number, items, totals, shipping address visible |
| POS-09 | Confirmation email enqueued | Email service mock on | Complete checkout | Outbox/job contains template `order_confirmation`, correct recipient |
| POS-10 | Idempotent checkout retry | Same idempotency key | POST checkout twice with same key | Single order; second response repeats first result |
| POS-11 | Guest checkout creates order | Guest session allowed | Checkout with email only (no account) | Order tied to email; optional account invite |
| POS-12 | Logged-in user checkout | Authenticated session | Checkout | Order linked to `user_id`; address book available |

## Negative test cases (failures, validation)

| ID | Title | Steps | Expected |
|----|--------|-------|----------|
| NEG-01 | Empty cart checkout | Open checkout with 0 items | `400` / UI blocks; message to add items |
| NEG-02 | Apply expired discount code | Enter `EXPIRED` | Rejected; no price change; clear message |
| NEG-03 | Apply exhausted global-limit code | Code at max redemptions | Rejected |
| NEG-04 | Apply code below minimum subtotal | Subtotal $5, code min $50 | Rejected |
| NEG-05 | Payment declined | Use mocked `card_declined` | Order not completed; user can retry payment |
| NEG-06 | Payment requires authentication (3DS) | Mock `requires_action` | UI or API returns action; no `paid` until completed |
| NEG-07 | Invalid/malformed discount code | Enter `%%%` or 500-char string | Validation error; no server 500 |
| NEG-08 | Checkout with zero or negative total after discount bug | (mutation test / API fuzz) | Server rejects non-positive totals if business forbids |
| NEG-09 | Missing shipping on physical goods | Remove address | Validation error before payment |

## Edge cases

| ID | Title | Steps | Expected |
|----|--------|-------|----------|
| EDGE-01 | Max line quantity per SKU | Request qty > `max_per_order` | Capped or rejected per policy; consistent messaging |
| EDGE-02 | Race: last unit in stock | Two buyers checkout concurrently | Only one succeeds; other gets `409` / sold out |
| EDGE-03 | Concurrent sessions same user | Two tabs change cart | Last-write-wins or merge rules documented; no corrupt totals |
| EDGE-04 | Double-submit same form | Rapid double click Pay | Idempotency or single charge |
| EDGE-05 | Cart size limit | Add 200 distinct lines | Limit enforced with friendly error |
| EDGE-06 | Currency rounding | Subtotal with .005 rounding | Consistent bankers/commercial rounding in display vs charged amount |
| EDGE-07 | Discount > subtotal | 100% + fixed stack misconfiguration | Total floors at 0 or rejected per policy |
| EDGE-08 | Session timeout mid-checkout | Expire session at payment step | Recovery path; cart not double-charged |

## Security & compliance

| ID | Title | Steps | Expected |
|----|--------|-------|----------|
| SEC-01 | No raw PAN in logs | Complete payment | Logs contain only last4 + brand or token id |
| SEC-02 | CVV never stored | Inspect DB after payment | No `cvv` column populated |
| SEC-03 | TLS for checkout API | MITM proxy http | Connection refused or HSTS upgrade |
| SEC-04 | Payment token server-side only | Inspect client bundle / network | No secret keys; only publishable key if applicable |
| SEC-05 | SQL injection in coupon field | `SAVE10'; DROP TABLE orders;--` | Parameterized query; no error leaking schema |
| SEC-06 | SQL injection in address line2 | Similar payload | Escaped / parameterized; order still safe |
| SEC-07 | XSS in gift message | `<script>alert(1)</script>` | Stored escaped; confirmation email HTML escaped |
| SEC-08 | Rate limit payment attempts | 50 failed payments / minute | `429` or captcha |
| SEC-09 | CSRF on state-changing checkout POST | Unauthenticated origin | Token validation fails |
| SEC-10 | Mass assignment on order create | Extra JSON `{"status":"shipped"}` | Ignored or rejected |
| SEC-11 | PCI segmentation (process note) | Architecture review | Card data touches only PSP or SAQ-A scope |

**Automated mapping:** `POS-*`, `NEG-*`, `EDGE-*`, `SEC-*` are partially covered by `tests/ecommerce_checkout/` (pytest) and `tests/checkout/*.test.ts` (Vitest). Full UI/E2E would extend Playwright with the same IDs in `test.describe` titles.

---

## Traceability summary

| Category | Count (this document) |
|----------|------------------------|
| Positive | 12 |
| Negative | 9 |
| Edge | 8 |
| Security | 11 |
| **Total** | **40** |

---

## How to run automated suites

**Python (pytest)** — prefer an isolated venv inside `tests/ecommerce_checkout`:

```bash
cd tests/ecommerce_checkout
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/pytest -v
```

Or from repo root:

```bash
pytest tests/ecommerce_checkout -v
```
(use the same venv’s `pytest` so `checkout_service` is on the path, or `cd tests/ecommerce_checkout` first.)

**Vitest (Jest-compatible API)** — from repo root:

```bash
npm install
npm run test:unit
```

Together, the automated suites provide **37** executable checks (29 pytest + 8 Vitest); extend Playwright to cover UI-heavy IDs (confirmation screens, double-submit, session timeout).
