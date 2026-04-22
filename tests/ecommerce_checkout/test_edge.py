"""Edge-case checkout tests (EDGE-*)."""

import pytest

from checkout_service import Cart, CheckoutError, Product, add_to_cart, grand_total_cents


def test_edge01_exceeds_max_per_order():
    cart = Cart()
    p = Product(sku="LIM", price_cents=100, stock=100, max_per_order=3)
    with pytest.raises(CheckoutError, match="per-order"):
        add_to_cart(cart, p, 4)


def test_edge02_last_unit_race_two_checkouts():
    """Second checkout sees zero stock after first buys the last unit."""
    cart_a = Cart()
    cart_b = Cart()
    catalog = Product(sku="ONE", price_cents=100, stock=1)
    add_to_cart(cart_a, catalog, 1)
    with pytest.raises(CheckoutError, match="Insufficient stock"):
        add_to_cart(cart_b, Product(sku="ONE", price_cents=100, stock=catalog.stock), 1)


def test_edge04_double_add_respects_stock():
    cart = Cart()
    p = Product(sku="S", price_cents=50, stock=2, max_per_order=5)
    add_to_cart(cart, p, 1)
    add_to_cart(cart, p, 1)
    assert cart.lines[0].qty == 2
    assert p.stock == 0


def test_edge06_grand_total_never_negative():
    assert grand_total_cents(100, 500, 0) == 0


def test_edge_cart_many_lines():
    cart = Cart()
    for i in range(50):
        p = Product(sku=f"S{i}", price_cents=1, stock=10)
        add_to_cart(cart, p, 1)
    assert len(cart.lines) == 50
