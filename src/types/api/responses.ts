export interface IApiProductResponse {
  id: string;
  title: string;
  price: number | null;
  description: string;
  images: string;
  category: string;
}

export interface IApiOrderResponse {
  id: string;          
  total: number;    
}