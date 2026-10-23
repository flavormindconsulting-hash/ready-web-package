import {useEffect,useState} from 'react';
import {Plus,Save,Ticket,Edit2,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {adminFetch} from '@/lib/admin-fetch';
import {promoSchema,type Promo} from '@/lib/promos';
const blank: Promo = {code:'',discountType:'percentage',value:10,minimumOrder:0,isEnabled:true,expiresAt:null};
export function PromoEditor() {
 const [promos,setPromos] = useState<Promo[]>([]);
 const [draft,setDraft] = useState<Promo|null>(null);
 const [error,setError] = useState(''); const [saving,setSaving] = useState(false);
 const load = async () => {try {const r = await adminFetch('/api/admin/promos',{cache:'no-store'});if (!r.ok) throw new Error();setPromos(await r.json());}catch{setError('Could not load promo codes.');}};
 useEffect(() => {void load();},[]);
 async function save(p:Promo) {
   const result = promoSchema.safeParse(p); if (!result.success) {setError(result.error.issues[0]?.message || 'Check promo details.');return;}
   setSaving(true);setError('');
   try {const r = await adminFetch('/api/admin/promos',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(result.data)});const b = await r.json();if (!r.ok) throw new Error(b.error);setDraft(null);await load();}catch(e){setError(e instanceof Error?e.message:'Could not save code.');}finally{setSaving(false);}
 }
 const field = 'w-full bg-background border border-border rounded px-3 py-2 text-sm';
 return <section className="space-y-6">
   <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-display flex items-center gap-2"><Ticket className="text-primary"/>Promo codes</h2><Button onClick={() => {setDraft({...blank});setError('');}}><Plus/>Add code</Button></div>
   {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
   {draft && <form onSubmit={e => {e.preventDefault();void save(draft);}} className="border-y border-border py-6 space-y-4">
     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
       <label className="space-y-2 text-sm">Code<input required maxLength={32} aria-label="Promo code" className={field} value={draft.code} onChange={e=>setDraft({...draft,code:e.target.value.toUpperCase()})}/></label>
       <label className="space-y-2 text-sm">Discount type<select className={field} value={draft.discountType} onChange={e=>setDraft({...draft,discountType:e.target.value as Promo['discountType']})}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed amount (₹)</option></select></label>
       <label className="space-y-2 text-sm">Discount value<input aria-label="Discount value" className={field} type="number" min="0.01" step="0.01" max={draft.discountType==='percentage'?100:undefined} required value={draft.value} onChange={e=>setDraft({...draft,value:Number(e.target.value)})}/></label>
       <label className="space-y-2 text-sm">Minimum order (₹)<input className={field} type="number" min="0" step="0.01" required value={draft.minimumOrder} onChange={e=>setDraft({...draft,minimumOrder:Number(e.target.value)})}/></label>
       <label className="space-y-2 text-sm">Expiry date (UTC)<input className={field} type="date" value={draft.expiresAt?.slice(0,10)||''} onChange={e=>setDraft({...draft,expiresAt:e.target.value?`${e.target.value}T23:59:59.000Z`:null})}/></label>
       <label className="flex items-center gap-3 text-sm">Enabled<Switch checked={draft.isEnabled} onCheckedChange={v=>setDraft({...draft,isEnabled:v})}/></label>
     </div>
     <div className="flex gap-3"><Button type="submit" disabled={saving}><Save/>{saving?'Saving…':'Save code'}</Button><Button type="button" variant="outline" onClick={()=>setDraft(null)}><X/>Cancel</Button></div>
   </form>}
   <div className="overflow-x-auto border border-border rounded"><table className="w-full text-sm text-left"><thead className="bg-muted text-muted-foreground"><tr>{['Code','Discount','Minimum','Expiry','Enabled',''].map((h,i)=><th className="p-4 whitespace-nowrap" key={i}>{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{promos.map(p=><tr key={p.id}><td className="p-4 font-mono font-semibold">{p.code}</td><td className="p-4 whitespace-nowrap">{p.discountType==='percentage'?`${p.value}%`:`₹${p.value}`}</td><td className="p-4">₹{p.minimumOrder}</td><td className="p-4 whitespace-nowrap">{p.expiresAt?.slice(0,10)||'No expiry'}</td><td className="p-4"><Switch aria-label={`Enable ${p.code}`} checked={p.isEnabled} disabled={saving} onCheckedChange={v=>void save({...p,isEnabled:v})}/></td><td className="p-4"><Button variant="ghost" size="icon" title={`Edit ${p.code}`} aria-label={`Edit ${p.code}`} onClick={()=>setDraft({...p})}><Edit2/></Button></td></tr>)}</tbody></table></div>
 </section>;
}
