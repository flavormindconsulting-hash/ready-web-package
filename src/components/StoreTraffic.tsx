import {useEffect} from 'react';
import {useRouterState} from '@tanstack/react-router';
import {isStorePage} from '@/lib/traffic';
export function StoreTraffic() {
  const path = useRouterState({select:s => s.location.pathname});
  useEffect(() => {
    if (!isStorePage(path) || navigator.doNotTrack === '1') return;
    try {
      let visit = sessionStorage.getItem('henro:visit');
      if (!visit) {visit = crypto.randomUUID(); sessionStorage.setItem('henro:visit',visit);}
      const key = `henro:view:${path}`;
      const previous = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - previous < 1000) return;
      sessionStorage.setItem(key,String(Date.now()));
      void fetch('/api/public/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visit,event:crypto.randomUUID(),path}),keepalive:true}).catch(() => {});
    } catch { /* Browser storage is optional. */ }
  },[path]);
  return null;
}
