export interface ICreateOrderRequest {
  payment: 'card' | 'cash';  
  email: string;
  phone: string;
  address: string;
  total: number;
  items: {
    id: string;     
    price: number;
    count: number;  
  }[];
}