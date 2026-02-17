
import axiosInstance from '@/data/axios/axiosInstance';

import { ApiResponse } from '../models/common.model';
import { ICart } from '../models/cart.model';



export const CartService = {

    getCartasync: (): Promise<ApiResponse<ICart>> => {
        return axiosInstance.get('/cart') as unknown as Promise<ApiResponse<ICart>>;
    },

    addToCartasync: (itemId: string, qty: number, sizeId?: string, colorId?: string): Promise<ApiResponse<ICart>> => {
        return axiosInstance.post('/cart/add', { itemId, qty, sizeId, colorId }) as unknown as Promise<ApiResponse<ICart>>;
    },

    addBulkToCartasync: (items: { itemId: string; qty: number; sizeId?: string; colorId?: string; }[]): Promise<ApiResponse<ICart>> => {
        return axiosInstance.post('/cart/bulk-add', { items }) as unknown as Promise<ApiResponse<ICart>>;
    },

    getCartCountasync: (): Promise<ApiResponse<{ count: number }>> => {
        return axiosInstance.get('/cart/count') as unknown as Promise<ApiResponse<{ count: number }>>;
    },

    updateItemQuantityasync: (cartItemId: string, qty: number): Promise<ApiResponse<ICart>> => {
        return axiosInstance.patch('/cart/items/' + cartItemId, { qty }) as unknown as Promise<ApiResponse<ICart>>;
    },

    removeItemFromCartasync: (cartItemId: string): Promise<ApiResponse<ICart>> => {
        return axiosInstance.delete('/cart/items/' + cartItemId) as unknown as Promise<ApiResponse<ICart>>;
    },

    clearCartasync: (): Promise<ApiResponse<ICart>> => {
        return axiosInstance.delete('/cart') as unknown as Promise<ApiResponse<ICart>>;
    }




}