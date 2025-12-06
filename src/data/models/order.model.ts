import { IAddress } from "./address.model";
import { UserData } from "./user.model";
import { Variant } from "./variants.model";

export interface IOrderItem {
  inventoryId: Variant;  // ObjectId as string
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


export interface OrderCreateItem{
     inventoryId: string;  // ObjectId as string
  qty: number;
}



export interface  CreateOrder{
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