import { Color } from "./color.model";
import { Item } from "./item.model";
import { Size } from "./size.model";

export interface Variant {
  price: number;
  compareAtPrice: number;
  costPrice: number;
  stock: number;
  sku: string;
  barcode: string;
  size: Size;
  color: Color;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
  item:Item;
}