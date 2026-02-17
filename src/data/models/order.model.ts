import { IAddress } from "./address.model";
import { UserData } from "./user.model";
import { Item } from "./item.model";

import { Color } from "./color.model";
import { Size } from "./size.model";

export interface IOrderItem {
  itemId: Item;  // ObjectId as string
  sizeId?: Size;
  colorId?: Color;
  qty: number;
}

export interface IPaymentDetails {
  method: 'cash' | 'card' | 'upi' | 'wallet' | 'cod';
  transactionId?: string;
  paymentGateway?: string;
  paidAt?: string;          // Dates as ISO strings
  failureReason?: string;
}

export interface IOrder {
  _id: string;
  userId: UserData;
  items: IOrderItem[];
  paymentDetails: IPaymentDetails;
  status:
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

  totalAmount: number;
  discount: number;

  deliveryType: 'standard' | 'express' | 'overnight' | 'pickup';

  paymentStatus:
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

  shippingAddressId: IAddress;
  billingAddressId?: IAddress;

  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;

  cancelledAt?: string;
  cancellationReason?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}


export interface OrderCreateItem {
  itemId: string;  // ObjectId as string
  sizeId?: string;
  colorId?: string;
  qty: number;
}



export interface CreateOrder {
  userId: string;
  items: OrderCreateItem[];
  paymentDetails: IPaymentDetails;
  status:
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

  totalAmount: number;
  discount: number;

  deliveryType: 'standard' | 'express' | 'overnight' | 'pickup';

  paymentStatus:
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

  shippingAddressId: string;
  billingAddressId?: string;

  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;

  cancelledAt?: string;
  cancellationReason?: string;

  trackingNumber?: string;
  notes?: string;
}