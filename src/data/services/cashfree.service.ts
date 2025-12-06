import axiosInstance from "../axios/axiosInstance";
import { CashFreeOrderCreate, CashfreeOrderResponse } from "../models/cashfree.model";
import { ApiResponse } from "../models/common.model";



export const CashFreePaymentService = {

createOrder : (body:CashFreeOrderCreate): Promise<ApiResponse<CashfreeOrderResponse>> => {
    return axiosInstance.post('/cashfree/create-order', body) as unknown as Promise<ApiResponse<CashfreeOrderResponse>>;
},
getById:(orderId:string): Promise<ApiResponse<CashfreeOrderResponse>> => {
    return axiosInstance.get('/cashfree/order/'+orderId) as unknown as Promise<ApiResponse<CashfreeOrderResponse>>;
}


}