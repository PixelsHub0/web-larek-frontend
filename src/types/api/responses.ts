export interface ApiProductResponse {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export interface ApiOrderResponse {
  id: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
  }[];
}