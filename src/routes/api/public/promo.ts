import { createFileRoute } from '@tanstack/react-router';
import { json } from '@/lib/store.server';
import { checkPromo, priceCart } from '@/lib/promos.server';
import { z } from 'zod';
export const Route = createFileRoute('/api/public/promo')({server:{handlers:{
  POST: async ({request}) => {
    try {
      const b = await request.json();
      const code = z.string().max(32).parse(b.code);
      const {subtotal} = await priceCart(b.items);
      return json({success:true,...await checkPromo(code,subtotal)});
    } catch(e) { return json({success:false,error:e instanceof z.ZodError ? 'Invalid shopping bag or promo code.' : e instanceof Error ? e.message : 'Cannot apply promo code.'},{status:400}); }
  }
}}});
