import { describe, expect, it } from "vitest";
import { nextAvailableSize, sizeValidationError, STANDARD_SIZES } from "@/lib/product-sizes";

describe("admin product sizes", () => {
  it("adds the next real missing size, never NEW", () => {
    expect(nextAvailableSize([])).toBe("S");
    expect(nextAvailableSize([{ size: "S", stock: 0 }, { size: "M", stock: 0 }])).toBe("L");
    expect(nextAvailableSize(STANDARD_SIZES.map((size) => ({ size, stock: 0 })))).toBeUndefined();
  });
  it("rejects placeholder, duplicate and invalid stock values", () => {
    expect(sizeValidationError([{ size: "NEW", stock: 5 }])).toBeTruthy();
    expect(sizeValidationError([{ size: "S", stock: 1 }, { size: "S", stock: 2 }])).toBeTruthy();
    expect(sizeValidationError([{ size: "M", stock: -1 }])).toBeTruthy();
    expect(sizeValidationError([{ size: "XL", stock: 1.5 }])).toBeTruthy();
    expect(sizeValidationError(STANDARD_SIZES.map((size) => ({ size, stock: 3 })))).toBeNull();
  });
});