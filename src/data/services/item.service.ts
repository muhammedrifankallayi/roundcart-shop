import axiosInstance from '@/data/axios/axiosInstance';
import { ApiResponse } from '@/data/models/common.model';
import { Item } from '@/data/models/item.model';
import { URL_PREFIX } from '../constants/constants';

export const ItemService = {
  /**
   * Get list of all items/variants
   * @returns Promise with ApiResponse containing array of ProductVariant
   */
  getItemList: async (): Promise<ApiResponse<Item[]>> => {
    try {
      const response = await axiosInstance.get(URL_PREFIX.items);
      return response as unknown as ApiResponse<Item[]>;
    } catch (error) {
      console.error('Error fetching item list:', error);
      throw error;
    }
  },

  /**
   * Get single item by ID
   * @param id - Product variant ID
   * @returns Promise with ApiResponse containing ProductVariant
   */
  getItemById: async (id: string): Promise<ApiResponse<Item>> => {
    try {
      const response = await axiosInstance.get(`${URL_PREFIX.items}/${id}`);
      return response as unknown as ApiResponse<Item>;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },
};
