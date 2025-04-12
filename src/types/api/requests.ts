export interface ICreateOrderRequest {
  payment: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}