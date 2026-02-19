import axiosInstance from "../axios/axiosInstance";
import { ApiResponse } from "../models/common.model";
import { IOrder, CreateOrder, IPaymentDetails } from "../models/order.model";




export const OrderService = {

    getListasync: (): Promise<ApiResponse<IOrder[]>> => {
        return axiosInstance.get('/orders') as unknown as Promise<ApiResponse<IOrder[]>>;
    },

    createOrder: (body: CreateOrder): Promise<ApiResponse<IOrder>> => {
        return axiosInstance.post('/orders', body) as unknown as Promise<ApiResponse<IOrder>>;
    },
    getById: (orderId: string): Promise<ApiResponse<IOrder>> => {
        return axiosInstance.get('/orders/' + orderId) as unknown as Promise<ApiResponse<IOrder>>;
    },
    cancelOrder: (orderId: string, cancellationReason?: string): Promise<ApiResponse<IOrder>> => {
        return axiosInstance.post('/orders/' + orderId + '/cancel', { cancellationReason }) as unknown as Promise<ApiResponse<IOrder>>;
    },
    returnOrder: (orderId: string, returnReason?: string): Promise<ApiResponse<IOrder>> => {
        return axiosInstance.post('/orders/' + orderId + '/return', { returnReason }) as unknown as Promise<ApiResponse<IOrder>>;
    },
    orderStatus: (orderId: string): Promise<ApiResponse<{ status: string }>> => {
        return axiosInstance.get('/orders/' + orderId + '/status') as unknown as Promise<ApiResponse<{ status: string }>>;
    }
    ,
    updatePaymentStatus: (orderId: string, body: IPaymentDetails): Promise<ApiResponse<IOrder>> => {
        return axiosInstance.put('/orders/' + orderId + '/payment-status', body) as unknown as Promise<ApiResponse<IOrder>>;
    }

}