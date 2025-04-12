export interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}