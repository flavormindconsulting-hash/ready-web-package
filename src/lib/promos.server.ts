import { db, toCamel } from './store.server';
import { cartItemsSchema, promoDiscount, promoSchema } from './promos';

export async function priceCart(items: unknown) {
  const parsed = cartItemsSchema.parse(items);
  const c = await db();
  const result = await c.from('products').select('id,price').in('id', [...new Set(parsed.map(i => i.productId))]);
  if (result.error) throw new Error('Cannot check current prices. Please try again.');
  const prices = new Map<number, number>((result.data ?? []).map((p: {id:number;price:number}) => [p.id, Number(p.price)]));
  const subtotal = parsed.reduce((sum, i) => {
    const price = prices.get(i.productId);
    if (price === undefined) throw new Error('A shirt in your bag is no longer available.');
    return sum + price * i.quantity;
  }, 0);
  return { subtotal: Math.round(subtotal * 100) / 100, prices };
}
export async function checkPromo(code: string, subtotal: number) {
  const clean = code.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,32}$/.test(clean)) throw new Error('Invalid promo code.');
  const c = await db();
  const { data, error } = await c.from('promo_codes').select('*').eq('code', clean).maybeSingle();
  if (error) throw new Error('Cannot check promo codes. Please try again.');
  if (!data) throw new Error('Invalid promo code.');
  const promo = promoSchema.parse(toCamel(data));
  return { code: promo.code, discount: promoDiscount(promo, subtotal), subtotal };
}
