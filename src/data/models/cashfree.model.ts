export interface CashFreeOrderCreate{
    orderId: string;
    amount: number;
    customerId: string;
    customerPhone: string;
}


export interface CashfreeOrderResponse {
  cart_details: any | null;
  cf_order_id: string;
  created_at: string;

  customer_details: {
    customer_id: string;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string;
    customer_uid: string | null;
  };

  entity: string;
  order_amount: number;
  order_currency: string;
  order_expiry_time: string;
  order_id: string;

  order_meta: {
    notify_url: string | null;
    payment_methods: string | null;
    payment_methods_filters: any | null;
    return_url: string;
  };

  order_note: string | null;
  order_splits: any[];
  order_status: string;
  order_tags: any | null;

  payment_session_id: string;

  products: {
    one_click_checkout: {
      enabled: boolean;
      conditions: any[];
    };
    verify_pay: {
      enabled: boolean;
      conditions: any[];
    };
  };

  terminal_data: any | null;
}
