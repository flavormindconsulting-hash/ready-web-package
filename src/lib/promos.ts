import { z } from 'zod';

export const promoSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,32}$/, 'Use 3–32 letters, numbers, hyphens or underscores.'),
  discountType: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().positive(),
  minimumOrder: z.coerce.number().min(0),
  isEnabled: z.boolean(),
  expiresAt: z.string().datetime().nullable(),
}).refine(p => p.discountType !== 'percentage' || p.value <= 100, { message: 'Percentage must not exceed 100.', path: ['value'] });
export type Promo = z.infer<typeof promoSchema>;
export const cartItemsSchema = z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(100) })).min(1).max(100);
export function promoDiscount(p: Promo, subtotal: number, now = Date.now()) {
  if (!p.isEnabled) throw new Error('This promo code is switched off.');
  if (p.expiresAt && Date.parse(p.expiresAt) <= now) throw new Error('This promo code has expired.');
  if (subtotal < p.minimumOrder) throw new Error(`Minimum order is ₹${p.minimumOrder.toFixed(2)}.`);
  return Math.round(Math.min(subtotal, p.discountType === 'percentage' ? subtotal * p.value / 100 : p.value) * 100) / 100;
}
