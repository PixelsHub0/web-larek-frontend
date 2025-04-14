import { IApiProductResponse } from "../api/responses";
import { IOrder } from "./order";
export interface IAppState {
  // Данные
  products: IApiProductResponse[];
  currentOrder?: IOrder;
  // Методы
  addToCart(product: IApiProductResponse, quantity: number): void;
  removeFromCart(productId: string): void;
  createOrder(): IOrder;
  validateOrder(): boolean;
}