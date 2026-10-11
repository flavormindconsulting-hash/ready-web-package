import white from '@/assets/white-shirt.jpg.asset.json';
import oliveFront from '@/assets/olive-front.jpg.asset.json';
import oliveBack from '@/assets/olive-back.jpg.asset.json';
import oliveDetail from '@/assets/olive-detail.jpg.asset.json';
import brownFront from '@/assets/brown-front.jpg.asset.json';
import brownBack from '@/assets/brown-back.jpg.asset.json';
import stoneFront from '@/assets/stone-front.jpg.asset.json';
import stoneBack from '@/assets/stone-back.jpg.asset.json';
import type { Product } from '@/lib/types';

export const brandMedia = {
  white: white.url,
  olive: oliveFront.url,
  oliveBack: oliveBack.url,
  oliveDetail: oliveDetail.url,
  brown: brownFront.url,
  brownBack: brownBack.url,
  stone: stoneFront.url,
  stoneBack: stoneBack.url,
};

// Only replace the original demo photography; owner-supplied product images win.
export function productImages(product: Pick<Product, 'images'>): string[] {
  let images: string[];
  try {
    const parsed: unknown = JSON.parse(product.images);
    images = Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [product.images];
  } catch {
    images = [product.images];
  }
  if (images[0] === '/products/classic-white-oxford.jpg') return [brandMedia.white];
  if (images[0] === '/products/washed-olive-linen.jpg') return [brandMedia.olive, brandMedia.oliveBack, brandMedia.oliveDetail];
  return images.filter(Boolean);
}