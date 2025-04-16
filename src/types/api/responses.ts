export interface IApiProductResponse {
  id: string;
  title: string;
  price: number | null;
  description: string;
  image: string;
  category: string;
}

export interface IApiOrderResponse {
  id: string;          
  total: number;    
}