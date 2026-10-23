import {describe,it,expect} from 'vitest';
import {promoSchema,promoDiscount} from '@/lib/promos';
import {isStorePage} from '@/lib/traffic';
const promo = {code:'TEST10',discountType:'percentage' as const,value:10,minimumOrder:0,isEnabled:true,expiresAt:null};
describe('owner-controlled discounts',() => {
 it('applies percentage discount using current subtotal',() => expect(promoDiscount(promo,1999)).toBe(199.9));
 it('caps fixed discounts at the subtotal',() => expect(promoDiscount({...promo,discountType:'fixed',value:2500},1999)).toBe(1999));
 it('rejects switched-off codes',() => expect(() => promoDiscount({...promo,isEnabled:false},1999)).toThrow());
 it('rejects expired codes',() => expect(() => promoDiscount({...promo,expiresAt:'2026-10-22T00:00:00Z'},1999,Date.parse('2026-10-23T00:00:00Z'))).toThrow());
 it('enforces minimum order',() => expect(() => promoDiscount({...promo,minimumOrder:2000},1999)).toThrow());
 it('rejects percentages over 100',() => expect(promoSchema.safeParse({...promo,value:101}).success).toBe(false));
});
describe('store traffic privacy',() => {
 it('never counts admin, sign-in or API pages',() => {expect(isStorePage('/admin')).toBe(false);expect(isStorePage('/auth')).toBe(false);expect(isStorePage('/api/admin/orders')).toBe(false);});
 it('counts storefront content only',() => {expect(isStorePage('/')).toBe(true);expect(isStorePage('/products/a-shirt')).toBe(true);expect(isStorePage('/products?email=x')).toBe(false);});
});
