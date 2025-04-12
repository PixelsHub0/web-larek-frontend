export interface AppState {
  products: Product[];
  cart: CartItem[];
  currentOrder?: Order;
}
