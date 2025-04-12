export interface IApiProductResponse {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export interface IApiOrderResponse {
  id: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
  }[];
}