
import axiosInstance from '@/data/axios/axiosInstance';

import { ApiResponse } from '../models/common.model';
import { ICart } from '../models/cart.model';



export const CartService = {

    getCartasync: (): Promise<ApiResponse<ICart>> => {
        return axiosInstance.get('/cart') as unknown as Promise<ApiResponse<ICart>>;
    },

    addToCartasync: (inventoryId: string, qty: number): Promise<ApiResponse<ICart>> => {
        return axiosInstance.post('/cart/add', { inventoryId, qty }) as unknown as Promise<ApiResponse<ICart>>;
    },

    addBulkToCartasync: (items: { inventoryId: string; qty: number; }[]): Promise<ApiResponse<ICart>> => {
        return axiosInstance.post('/cart/bulk-add', { items }) as unknown as Promise<ApiResponse<ICart>>;
    },

    getCartCountasync: (): Promise<ApiResponse<{ count: number }>> => {
        return axiosInstance.get('/cart/count') as unknown as Promise<ApiResponse<{ count: number }>>;
    },

    updateItemQuantityasync: (inventoryId: string, qty: number): Promise<ApiResponse<ICart>> => {
        return axiosInstance.patch('/cart/items/' + inventoryId, { qty }) as unknown as Promise<ApiResponse<ICart>>;
    },

    removeItemFromCartasync: (inventoryId: string): Promise<ApiResponse<ICart>> => {
        return axiosInstance.delete('/cart/items/' + inventoryId) as unknown as Promise<ApiResponse<ICart>>;
    },

    clearCartasync: (): Promise<ApiResponse<ICart>> => {
        return axiosInstance.delete('/cart') as unknown as Promise<ApiResponse<ICart>>;
    }




}