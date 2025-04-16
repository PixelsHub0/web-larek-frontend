export interface ICreateOrderRequest {
  payment: 'online' | 'cash';  
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}