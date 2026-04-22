"""
Minimal checkout domain module for automated tests.
Represents patterns for cart, discounts, payment tokens, and safe string handling.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any
import re


class CheckoutError(Exception):
    """Domain error for invalid checkout operations."""


class PaymentResult(str, Enum):
    SUCCESS = "success"
    DECLINED = "declined"
    REQUIRES_ACTION = "requires_action"
    INVALID_TOKEN = "invalid_token"


@dataclass
class Product:
    sku: str
    price_cents: int
    stock: int
    max_per_order: int = 99
    name: str = ""


@dataclass
class CartLine:
    sku: str
    qty: int
    unit_price_cents: int


@dataclass
class DiscountRule:
    code: str
    percent: int | None = None
    fixed_cents: int | None = None
    min_subtotal_cents: int = 0
    expires_at: datetime | None = None
    global_redemptions_left: int | None = None
    stackable: bool = True


@dataclass
class Cart:
    lines: list[CartLine] = field(default_factory=list)

    def subtotal_cents(self) -> int:
        return sum(line.qty * line.unit_price_cents for line in self.lines)

    def is_empty(self) -> bool:
        return len(self.lines) == 0


def _looks_like_sql_injection(value: str) -> bool:
    """Heuristic guard for test scenarios; production should use parameterized queries."""
    lowered = value.lower()
    patterns = (
        r"(\bunion\b.*\bselect\b)",
        r";\s*drop\s+",
        r"--",
        r"/\*",
        r"\bor\b\s+1\s*=\s*1",
        r"'\s*;|\bexec\b",
    )
    return any(re.search(p, lowered) for p in patterns)


def normalize_coupon_code(raw: str) -> str:
    if not raw or not raw.strip():
        raise CheckoutError("Coupon code is required")
    if len(raw) > 64:
        raise CheckoutError("Coupon code too long")
    if _looks_like_sql_injection(raw):
        raise CheckoutError("Invalid coupon code")
    return raw.strip().upper()


def add_to_cart(
    cart: Cart,
    product: Product,
    qty: int,
    *,
    reserve_stock: bool = True,
) -> None:
    if qty <= 0:
        raise CheckoutError("Quantity must be positive")
    for line in cart.lines:
        if line.sku == product.sku:
            new_qty = line.qty + qty
            if new_qty > product.max_per_order:
                raise CheckoutError("Quantity exceeds per-order limit")
            if new_qty > line.qty + product.stock:
                raise CheckoutError("Insufficient stock")
            line.qty = new_qty
            break
    else:
        if qty > product.max_per_order:
            raise CheckoutError("Quantity exceeds per-order limit")
        if qty > product.stock:
            raise CheckoutError("Insufficient stock")
        cart.lines.append(
            CartLine(sku=product.sku, qty=qty, unit_price_cents=product.price_cents)
        )

    if reserve_stock:
        product.stock -= qty


def apply_discount(
    cart: Cart,
    rule: DiscountRule,
    *,
    already_applied_exclusive: bool = False,
) -> int:
    """Return discount amount in cents (non-negative)."""
    if cart.is_empty():
        raise CheckoutError("Cannot apply discount to empty cart")

    code = normalize_coupon_code(rule.code)
    rule_normalized = DiscountRule(
        code=code,
        percent=rule.percent,
        fixed_cents=rule.fixed_cents,
        min_subtotal_cents=rule.min_subtotal_cents,
        expires_at=rule.expires_at,
        global_redemptions_left=rule.global_redemptions_left,
        stackable=rule.stackable,
    )

    if already_applied_exclusive and not rule_normalized.stackable:
        raise CheckoutError("Discount cannot be combined")

    now = datetime.now(timezone.utc)
    if rule_normalized.expires_at and rule_normalized.expires_at < now:
        raise CheckoutError("Coupon expired")

    if (
        rule_normalized.global_redemptions_left is not None
        and rule_normalized.global_redemptions_left <= 0
    ):
        raise CheckoutError("Coupon no longer available")

    subtotal = cart.subtotal_cents()
    if subtotal < rule_normalized.min_subtotal_cents:
        raise CheckoutError("Subtotal below minimum for this coupon")

    discount = 0
    if rule_normalized.percent is not None:
        discount += (subtotal * rule_normalized.percent) // 100
    if rule_normalized.fixed_cents is not None:
        discount += rule_normalized.fixed_cents

    discount = min(subtotal, discount)
    return discount


def grand_total_cents(subtotal_cents: int, discount_cents: int, shipping_cents: int) -> int:
    total = subtotal_cents - discount_cents + shipping_cents
    if total < 0:
        return 0
    return total


def mock_process_payment(payment_token: str) -> PaymentResult:
    if not payment_token or not payment_token.startswith("tok_"):
        return PaymentResult.INVALID_TOKEN
    if "decline" in payment_token:
        return PaymentResult.DECLINED
    if "action" in payment_token:
        return PaymentResult.REQUIRES_ACTION
    return PaymentResult.SUCCESS


def redact_payment_log(payment_token: str, last4: str) -> dict[str, str]:
    """Simulate PCI-friendly logging: never log full token or PAN."""
    safe: dict[str, str] = {
        "token_suffix": payment_token[-4:] if len(payment_token) >= 4 else "****",
        "last4": last4,
    }
    return safe


def sanitize_order_email_payload(email: str, gift_message: str | None) -> dict[str, Any]:
    """Strip scripts for HTML email contexts (test double)."""
    if not email or "@" not in email:
        raise CheckoutError("Invalid email")
    msg = gift_message or ""
    cleaned = (
        msg.replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("script", "")
    )
    return {"to": email.strip().lower(), "gift_message": cleaned}

