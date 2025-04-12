import { IProduct } from "./product";
import { ICartItem } from "./product";
import { IOrder } from "./order";
export interface IAppState {
  products: IProduct[];
  cart: ICartItem[];
  currentOrder?: IOrder;
}
