import { Variant } from "./variants.model";

export interface ICartItem {
    inventoryId:  Variant;
    qty: number;
}

export interface ICart  {
    _id: string;
    userId: string;
    items: ICartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}