import { IApiProductResponse } from "../api/responses";
export interface ICartItem {
  product: IApiProductResponse;
  updateQuantity(newQuantity: number): void;
  calculateTotal(): number;
  validate(): boolean;
}