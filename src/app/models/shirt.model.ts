export type ShirtSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

export interface ShirtPurchase {
  size: ShirtSizes;
  sizePrice: number;
  quantity: number;
}
