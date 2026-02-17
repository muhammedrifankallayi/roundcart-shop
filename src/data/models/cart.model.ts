import { Color } from "./color.model";
import { Item } from "./item.model";
import { Size } from "./size.model";

export interface ICartItem {
    _id?: string;
    itemId: Item;
    sizeId?: Size;
    colorId?: Color;
    qty: number;
}

export interface ICart {
    _id: string;
    userId: string;
    items: ICartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}