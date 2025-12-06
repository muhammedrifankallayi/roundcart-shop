
import axiosInstance from '@/data/axios/axiosInstance';

import { ApiResponse } from '../models/common.model';
import { Color } from '../models/color.model';


export const ColorService = {

getListasync : (): Promise<ApiResponse<Color[]>> => {

    return axiosInstance.get('/colors') as unknown as Promise<ApiResponse<Color[]>>;
}

}