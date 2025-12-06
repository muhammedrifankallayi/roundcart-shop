

export interface IAddress {
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country?: string;
  _id?:string;
    createdAt?: Date;
    updatedAt?: Date;

}