import { createFileRoute } from '@tanstack/react-router';
import { db, json, requireAdmin, rows, toSnake } from '@/lib/store.server';
import { promoSchema } from '@/lib/promos';
export const Route = createFileRoute('/api/admin/promos')({ server: { handlers: {
  GET: async ({request}) => {
    const denied = await requireAdmin(request); if (denied) return denied;
    const c = await db(); const r = await c.from('promo_codes').select('*').order('created_at');
    if (r.error) return json({error:'Could not load promo codes.'}, {status:500});
    return new Response(JSON.stringify(rows(r.data)), {headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  },
  PUT: async ({request}) => {
    const denied = await requireAdmin(request); if (denied) return denied;
    try {
      const parsed = promoSchema.safeParse(await request.json());
      if (!parsed.success) return json({error:parsed.error.issues[0]?.message}, {status:400});
      const c = await db(); const payload = toSnake({...parsed.data, updatedAt: new Date().toISOString()});
      const r = parsed.data.id ? await c.from('promo_codes').update(payload).eq('id',parsed.data.id).select().single() : await c.from('promo_codes').insert(payload).select().single();
      if (r.error) return json({error:r.error.code === '23505' ? 'That code already exists.' : 'Could not save promo code.'},{status:400});
      return json({success:true});
    } catch { return json({error:'Invalid promo details.'},{status:400}); }
  }
}}});
