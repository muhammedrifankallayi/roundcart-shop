
import { ApiResponse } from "../models/common.model";
import axiosInstance from "../axios/axiosInstance";
import { create } from "domain";
import { IAddress } from "../models/address.model";


export const AddressService = {

getListasync : (): Promise<ApiResponse<IAddress[]>> => {

    return axiosInstance.get('/shipping-addresses') as unknown as Promise<ApiResponse<IAddress[]>>;
},

getById:(id:string): Promise<ApiResponse<IAddress>> => {
    return axiosInstance.get('/shipping-addresses/'+id) as unknown as Promise<ApiResponse<IAddress>>;
},

createAsync:(address:IAddress): Promise<ApiResponse<IAddress>> => {
    return axiosInstance.post('/shipping-addresses',address) as unknown as Promise<ApiResponse<IAddress>>;
},

updateAsync:(id:string,address:IAddress): Promise<ApiResponse<IAddress>> => {
    return axiosInstance.put('/shipping-addresses/'+id,address) as unknown as Promise<ApiResponse<IAddress>>;
},
deleteAsync:(id:string): Promise<ApiResponse<null>> => {
    return axiosInstance.delete('/shipping-addresses/'+id) as unknown as Promise<ApiResponse<null>>;
}

}