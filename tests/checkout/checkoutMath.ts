/** Pure helpers for checkout unit tests (client or shared validation logic). */

export type CartLine = { sku: string; qty: number; unitPriceCents: number };

export function subtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty * l.unitPriceCents, 0);
}

export function applyPercentDiscount(subtotal: number, percent: number): number {
  if (percent < 0 || percent > 100) throw new Error('Invalid percent');
  return Math.floor((subtotal * percent) / 100);
}

export function grandTotalCents(
  subtotal: number,
  discount: number,
  shipping: number,
): number {
  const t = subtotal - discount + shipping;
  return t < 0 ? 0 : t;
}

const SQLISH = /(\bunion\b.*\bselect\b)|;\s*drop\s+|--|\/\*|\bor\b\s+1\s*=\s*1|';\s*|\bexec\b/i;

export function assertSafeCouponCode(raw: string): string {
  const code = raw.trim();
  if (!code) throw new Error('Coupon required');
  if (code.length > 64) throw new Error('Coupon too long');
  if (SQLISH.test(code)) throw new Error('Invalid coupon');
  return code.toUpperCase();
}

export type MockPaymentToken = string;

export function mockPaymentResult(token: MockPaymentToken): 'success' | 'declined' | 'requires_action' | 'invalid' {
  if (!token.startsWith('tok_')) return 'invalid';
  if (token.includes('decline')) return 'declined';
  if (token.includes('action')) return 'requires_action';
  return 'success';
}

export function redactTokenForLog(token: string): { tokenSuffix: string } {
  return { tokenSuffix: token.slice(-4).padStart(4, '*') };
}
