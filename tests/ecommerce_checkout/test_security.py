"""Security-oriented checkout tests (SEC-*)."""

import pytest

from checkout_service import (
    Cart,
    CheckoutError,
    DiscountRule,
    Product,
    _looks_like_sql_injection,
    apply_discount,
    add_to_cart,
    sanitize_order_email_payload,
)


@pytest.mark.parametrize(
    "payload",
    [
        "SAVE10'; DROP TABLE orders;--",
        "foo' OR 1=1--",
        "user/**/; DROP SCHEMA public--",
    ],
)
def test_sec05_sql_injection_coupon_rejected(payload: str):
    cart = Cart()
    p = Product(sku="P", price_cents=5000, stock=5)
    add_to_cart(cart, p, 1)
    rule = DiscountRule(code=payload, percent=10)
    with pytest.raises(CheckoutError, match="Invalid coupon"):
        apply_discount(cart, rule)


def test_sec06_address_sql_heuristic():
    assert _looks_like_sql_injection("123 Main'; DELETE FROM users;--")


def test_sec07_xss_gift_message_sanitized():
    out = sanitize_order_email_payload(
        "buyer@example.com",
        '<script>alert(1)</script>Thanks!',
    )
    assert "<script>" not in out["gift_message"]
    assert "alert" not in out["gift_message"] or "&gt;" in out["gift_message"]


def test_sec_discounted_cannot_bypass_normalize():
    cart = Cart()
    add_to_cart(cart, Product(sku="P", price_cents=1000, stock=5), 1)
    with pytest.raises(CheckoutError, match="Invalid coupon"):
        apply_discount(cart, DiscountRule(code="';--", percent=1))
