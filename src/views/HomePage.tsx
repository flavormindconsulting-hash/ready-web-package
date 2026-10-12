import Link from '@/compat/next-link';
import type { Product } from '@/lib/types';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomeClientSection } from '@/components/HomeClientSection';
import { brandMedia } from '@/lib/brand-media';
import campaign from '@/assets/henro-campaign.jpg';
import eagleLogo from '@/assets/henro-eagle-logo.jpg.asset.json';

export default function HomePage({ featuredProducts, bestsellers }: { featuredProducts: Product[]; bestsellers: Product[] }) {
  const edits = [
    { title: 'The white shirt', caption: 'A fresh perspective on a classic.', image: brandMedia.white, href: '/products?category=Oxford+%26+Formal' },
    { title: 'Off-duty essentials', caption: 'Easy layers. A considered finish.', image: brandMedia.brown, href: '/products?category=Overshirts' },
    { title: 'The neutral edit', caption: 'Understated, never ordinary.', image: brandMedia.stone, href: '/products' },
  ];
  return <div className="bg-background text-foreground">
    <section className="campaign relative overflow-hidden flex items-end sm:items-center">
      <picture><source media="(max-width: 639px)" srcSet={brandMedia.olive} /><img src={campaign} alt="HENRO olive shirt styled on a city street" className="absolute inset-0 w-full h-full object-cover object-[65%_center]" fetchPriority="high" /></picture>
      <div className="absolute inset-0 campaign-scrim" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-16 w-full text-campaign-foreground">
        <div className="max-w-lg animate-fade-in">
          <p className="text-xs uppercase mb-5 text-brand-gold">HENRO / THE EVERYDAY EDIT</p>
          <h1 className="font-display text-6xl sm:text-7xl font-medium leading-none">HENRO</h1>
          <p className="font-display text-3xl sm:text-4xl mt-3 leading-tight">A signature of your own.</p>
          <p className="text-sm leading-relaxed mt-5 max-w-xs opacity-90">Quiet confidence. Distinctive details.<br />Shirts that feel unmistakably you.</p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-none shadow-none"><Link href="/products">Explore the collection <ArrowRight /></Link></Button>
        </div>
      </div>
      <span className="absolute bottom-6 right-8 text-campaign-foreground text-xs hidden sm:block">01 / THE OLIVE EDIT</span>
    </section>
    <div className="border-b border-border py-4 px-4 flex justify-center items-center gap-5 sm:gap-12 text-[10px] sm:text-xs uppercase text-muted-foreground">
      <span>Signature shirting</span><Plus className="size-3" /><span>Considered details</span><Plus className="size-3 hidden sm:block" /><span className="hidden sm:block">Everyday confidence</span>
    </div>
    <HomeClientSection featuredProducts={featuredProducts} bestsellers={bestsellers} />
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 mb-8">
        <div><p className="text-xs text-muted-foreground mb-2">THE WARDROBE EDIT</p><h2 className="font-display text-3xl sm:text-4xl">Different days. Same signature.</h2></div>
        <Link href="/products" aria-label="View all shirts" className="p-3 border border-border"><ArrowRight className="size-5" /></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-5">
        {edits.map(edit => <Link key={edit.title} href={edit.href} className="group min-w-0">
          <div className="aspect-[3/4] overflow-hidden bg-muted"><img src={edit.image} alt={edit.title} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" /></div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center mt-4"><h3 className="font-display text-xl">{edit.title}</h3><ArrowRight className="size-4" /></div><p className="text-xs text-muted-foreground mt-1">{edit.caption}</p>
        </Link>)}
      </div>
    </section>
    <section className="bg-muted border-y border-border mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden"><img src={brandMedia.oliveDetail} alt="Olive HENRO shirt fabric and pocket detailing" loading="lazy" className="w-full h-full object-cover object-[center_38%]" /></div>
        <div className="px-6 sm:px-12 py-14 sm:py-20 flex flex-col justify-center items-start">
          <img src={eagleLogo.url} alt="HENRO gold eagle emblem" className="w-36 h-36 object-contain mb-6" />
          <p className="text-xs text-brand-gold mb-5">THE HENRO PERSPECTIVE</p><h2 className="font-display text-4xl sm:text-5xl leading-tight">It's all in<br />the details.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-sm mt-6">A crisp collar. An easy silhouette. A signature detail. Meet the shirts that bring your everyday wardrobe together.</p>
          <Button asChild variant="link" className="p-0 mt-8"><Link href="/products">Find your signature <ArrowRight /></Link></Button>
        </div>
      </div>
    </section>
  </div>;
}
