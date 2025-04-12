import { ICartItem } from "../app/product";
import { IProduct } from "../app/product"
import { IOrder } from "../app/order";
import { AppEvents } from "./enum";

export interface IEventMap {
  [AppEvents.PRODUCTS_LOADED]: IProduct[];
  [AppEvents.CART_UPDATED]: ICartItem[];
  [AppEvents.ORDER_CREATED]: IOrder;
  [AppEvents.ERROR_OCCURRED]: { message: string };
}