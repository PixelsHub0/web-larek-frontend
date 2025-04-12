import { IApiProductResponse } from "./responses";
import { ICreateOrderRequest } from "./requests";
import { IApiOrderResponse } from "./responses";
export interface IApiClient {
  getProducts(): Promise<IApiProductResponse[]>;
  createOrder(order: ICreateOrderRequest): Promise<IApiOrderResponse>;
  getProduct(id: string): Promise<IApiProductResponse>;
}