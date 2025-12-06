



import axiosInstance from '@/data/axios/axiosInstance';
import { ApiResponse } from '../models/common.model';
import { Variant } from '../models/variants.model';


export const VariantsService = {
getListByItemId: (itemId:string): Promise<ApiResponse<Variant[]>> => {
    return axiosInstance.get('/public/variants/'+itemId) as unknown as Promise<ApiResponse<Variant[]>>;
}
}