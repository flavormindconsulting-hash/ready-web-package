import type { ProductSize } from "@/lib/types";

export const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export function nextAvailableSize(sizes: ProductSize[]) {
  return STANDARD_SIZES.find((size) => !sizes.some((row) => row.size === size));
}

export function sizeValidationError(sizes: ProductSize[]): string | null {
  if (sizes.some((row) => !STANDARD_SIZES.some((size) => size === row.size)))
    return "Choose S, M, L, XL or XXL for each size.";
  if (new Set(sizes.map((row) => row.size)).size !== sizes.length)
    return "Each size can only be added once.";
  if (sizes.some((row) => !Number.isInteger(row.stock) || row.stock < 0))
    return "Stock must be a whole number of zero or more.";
  return null;
}