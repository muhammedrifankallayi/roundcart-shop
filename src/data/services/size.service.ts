
import axiosInstance from '@/data/axios/axiosInstance';
import { Size } from '../models/size.model';
import { ApiResponse } from '../models/common.model';


export const SizeService = {

getListasync : (): Promise<ApiResponse<Size[]>> => {

    return axiosInstance.get('/sizes') as unknown as Promise<ApiResponse<Size[]>>;
}

}