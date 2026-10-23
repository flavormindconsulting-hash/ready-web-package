import {createFileRoute} from '@tanstack/react-router';
import {db, json} from '@/lib/store.server';
import {isStorePage} from '@/lib/traffic';
import {z} from 'zod';
export const Route = createFileRoute('/api/public/visit')({server:{handlers:{POST:async ({request}) => {
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin) return json({error:'Forbidden'},{status:403});
  if (/bot|crawler|spider|headless/i.test(request.headers.get('user-agent') ?? '')) return new Response(null,{status:204});
  try {
    const b = z.object({visit:z.string().uuid(),event:z.string().uuid(),path:z.string().max(160).refine(isStorePage)}).parse(await request.json());
    const c = await db(); const r = await c.rpc('record_store_view',{p_visit:b.visit,p_event:b.event,p_path:b.path});
    return new Response(null,{status:r.error ? 503 : 204});
  } catch {return json({error:'Invalid visit'},{status:400});}
}}}});
