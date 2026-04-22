"""Positive-path checkout tests (POS-*)."""

import pytest

from checkout_service import (
    Cart,
    DiscountRule,
    PaymentResult,
    Product,
    add_to_cart,
    apply_discount,
    grand_total_cents,
    mock_process_payment,
    redact_payment_log,
    sanitize_order_email_payload,
)


def test_pos01_add_single_item_empty_cart():
    cart = Cart()
    product = Product(sku="SKU1", price_cents=1999, stock=5)
    add_to_cart(cart, product, 1)
    assert len(cart.lines) == 1
    assert cart.subtotal_cents() == 1999
    assert product.stock == 4


def test_pos02_add_multiple_skus():
    cart = Cart()
    a = Product(sku="A", price_cents=1000, stock=10)
    b = Product(sku="B", price_cents=500, stock=10)
    add_to_cart(cart, a, 1)
    add_to_cart(cart, b, 2)
    assert {line.sku: line.qty for line in cart.lines} == {"A": 1, "B": 2}
    assert cart.subtotal_cents() == 1000 + 1000


def test_pos03_increment_existing_line():
    cart = Cart()
    p = Product(sku="X", price_cents=300, stock=10, max_per_order=5)
    add_to_cart(cart, p, 2)
    add_to_cart(cart, p, 1)
    assert cart.lines[0].qty == 3
    assert cart.subtotal_cents() == 900


def test_pos04_percent_discount():
    cart = Cart()
    p = Product(sku="P", price_cents=2000, stock=5)
    add_to_cart(cart, p, 1)
    rule = DiscountRule(code="SAVE10", percent=10, min_subtotal_cents=0)
    d = apply_discount(cart, rule)
    assert d == 200
    assert grand_total_cents(cart.subtotal_cents(), d, 500) == 2000 - 200 + 500


def test_pos05_fixed_discount_capped_by_subtotal():
    cart = Cart()
    p = Product(sku="P", price_cents=400, stock=5)
    add_to_cart(cart, p, 1)
    rule = DiscountRule(code="FLAT500", fixed_cents=500, min_subtotal_cents=0)
    d = apply_discount(cart, rule)
    assert d == 400


def test_pos07_payment_success():
    assert mock_process_payment("tok_visa_ok") == PaymentResult.SUCCESS


def test_pos09_email_payload_basic():
    payload = sanitize_order_email_payload("User@Example.com", None)
    assert payload["to"] == "user@example.com"


def test_pos10_idempotent_grand_total_stable():
    subtotal = 5000
    discount = 500
    shipping = 0
    t1 = grand_total_cents(subtotal, discount, shipping)
    t2 = grand_total_cents(subtotal, discount, shipping)
    assert t1 == t2 == 4500


def test_redact_log_no_full_token():
    log = redact_payment_log("tok_supersecretpayment", "4242")
    assert "supersecret" not in "".join(log.values())

