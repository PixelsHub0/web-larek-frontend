import { ICartItem } from "./product";
export interface IOrderForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IOrderForm {
  items: ICartItem[];
  total: number;
  addItems(items: ICartItem[]): void;
  validate(): boolean;
}