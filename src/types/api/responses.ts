export interface IApiProductResponse { //IApiProductResponse приходит в ответ на GET /product или GET /product/:id
  id: string; //Уникальный идентификатор товара
  title: string; //	Название товара
  price: number | null; //	Цена в рублях. Может быть null, если цена ещё не указана
  description: string; //	Подробное описание товара
  image: string; //	Ссылка на изображение
  category: string; //	Категория товара
} 

export interface IApiOrderResponse { //IApiOrderResponse — ответ на POST /order после оформления заказа
  id: string; //	Уникальный ID заказа   
  total: number; //Общая сумма заказа, как её посчитал сервер
}