"""Negative checkout tests (NEG-*)."""

from datetime import datetime, timedelta, timezone

import pytest

from checkout_service import (
    Cart,
    CheckoutError,
    DiscountRule,
    PaymentResult,
    Product,
    add_to_cart,
    apply_discount,
    mock_process_payment,
    sanitize_order_email_payload,
)


def test_neg01_empty_cart_discount():
    cart = Cart()
    rule = DiscountRule(code="SAVE10", percent=10)
    with pytest.raises(CheckoutError, match="empty cart"):
        apply_discount(cart, rule)


def test_neg02_expired_coupon():
    cart = Cart()
    p = Product(sku="P", price_cents=1000, stock=2)
    add_to_cart(cart, p, 1)
    past = datetime.now(timezone.utc) - timedelta(days=1)
    rule = DiscountRule(code="EXPIRED", percent=10, expires_at=past)
    with pytest.raises(CheckoutError, match="expired"):
        apply_discount(cart, rule)


def test_neg03_exhausted_global_coupon():
    cart = Cart()
    p = Product(sku="P", price_cents=1000, stock=2)
    add_to_cart(cart, p, 1)
    rule = DiscountRule(code="LIMIT", percent=5, global_redemptions_left=0)
    with pytest.raises(CheckoutError, match="no longer available"):
        apply_discount(cart, rule)


def test_neg04_below_minimum_subtotal():
    cart = Cart()
    p = Product(sku="P", price_cents=500, stock=2)
    add_to_cart(cart, p, 1)
    rule = DiscountRule(code="BIGMIN", percent=10, min_subtotal_cents=5000)
    with pytest.raises(CheckoutError, match="below minimum"):
        apply_discount(cart, rule)


def test_neg05_payment_declined():
    assert mock_process_payment("tok_decline_visa") == PaymentResult.DECLINED


def test_neg07_invalid_coupon_characters_length():
    with pytest.raises(CheckoutError):
        apply_discount(Cart(), DiscountRule(code="x" * 200, percent=1))


def test_neg09_invalid_email():
    with pytest.raises(CheckoutError):
        sanitize_order_email_payload("not-an-email", None)


def test_add_non_positive_qty():
    cart = Cart()
    p = Product(sku="P", price_cents=100, stock=5)
    with pytest.raises(CheckoutError, match="positive"):
        add_to_cart(cart, p, 0)


def test_payment_invalid_token():
    assert mock_process_payment("") == PaymentResult.INVALID_TOKEN
    assert mock_process_payment("plaintext_pan") == PaymentResult.INVALID_TOKEN
