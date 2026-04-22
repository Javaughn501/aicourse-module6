import { describe, expect, it } from 'vitest';
import {
  applyPercentDiscount,
  assertSafeCouponCode,
  grandTotalCents,
  mockPaymentResult,
  redactTokenForLog,
  subtotalCents,
} from './checkoutMath';

describe('checkout math (POS / EDGE)', () => {
  it('POS-01 subtotal single line', () => {
    expect(subtotalCents([{ sku: 'a', qty: 1, unitPriceCents: 1999 }])).toBe(1999);
  });

  it('POS-04 percent discount', () => {
    expect(applyPercentDiscount(2000, 10)).toBe(200);
  });

  it('EDGE-06 grand total floors at zero', () => {
    expect(grandTotalCents(100, 500, 0)).toBe(0);
  });
});

describe('payments (POS / NEG)', () => {
  it('POS-07 success token', () => {
    expect(mockPaymentResult('tok_visa_ok')).toBe('success');
  });

  it('NEG-05 declined', () => {
    expect(mockPaymentResult('tok_decline_visa')).toBe('declined');
  });

  it('NEG invalid token', () => {
    expect(mockPaymentResult('pan_4242424242424242')).toBe('invalid');
  });
});

describe('security (SEC)', () => {
  it('SEC-05 rejects injection-like coupon', () => {
    expect(() => assertSafeCouponCode("SAVE10'; DROP TABLE orders;--")).toThrow(/Invalid coupon/);
  });

  it('SEC-01 redaction hides body of token', () => {
    const log = redactTokenForLog('tok_supersecret_value');
    expect(JSON.stringify(log)).not.toContain('supersecret');
  });
});
