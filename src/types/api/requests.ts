export interface ICreateOrderRequest { //Интерфейс ICreateOrderRequest описывает структуру данных, которые будут отправлены в теле POST-запроса
  payment: 'online' | 'cash';  //Способ оплаты
  email: string; //	Email пользователя. Используется для уведомлений
  phone: string; //	Телефон для связи или доставки
  address: string; //	Адрес доставки или самовывоза
  total: number; //Общая сумма заказа в рублях 
  items: string[]; //	Массив ID товаров, которые были добавлены в корзину
}