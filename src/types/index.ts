/**
 * Интерфейс, описывающий ответ сервера при успешном оформлении заказа
 */
export interface IOrderResponse {
  id: string; // уникальный идентификатор созданного заказа
  total: number; // общая стоимость заказа
}

/**
 * Тип, определяющий HTTP-методы, используемые для отправки данных на сервер
 */
export type ApiPostMethods = "POST" | "PUT" | "DELETE";

/**
 * Интерфейс для API-клиента, определяющий методы для выполнения HTTP-запросов
 */
export interface IApi {
  /**
   * Выполняет GET-запрос к указанному URI
   * @param {string} uri - путь к ресурсу на сервере
   * @returns Promise<T> - промис с данными ответа
   */
  get<T extends object>(uri: string): Promise<T>;

  /**
   * Выполняет POST, PUT или DELETE запрос к указанному URI
   * @param {string} uri - путь к ресурсу на сервере
   * @param {object} data - данные для отправки на сервер
   * @param {ApiPostMethods} method - HTTP-метод
   * @returns Promise<T> - промис с данными ответа
   */
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

/**
 * Тип, определяющий возможные способы оплаты в приложении
 */
export type TPayment = "card" | "cash";

/**
 * Интерфейс, описывающий товар в каталоге магазина
 */
export interface IProduct {
  id: string; // уникальный идентификатор товара
  description: string; // описание товара
  image: string; // URL изображения товара
  title: string; // название товара
  category: string; // категория товара
  price: number | null; // цена товара (может отсутствовать)
}

/**
 * Интерфейс, описывающий данные покупателя при оформлении заказа
 */
export interface IBuyer {
  payment: TPayment; // способ оплаты (`'card'` или `'cash'`)
  email: string; // электронная почта покупателя
  phone: string; // номер телефона покупателя
  address: string; // адрес доставки
}

/**
 * Интерфейс, описывающий информацию о заказе (товары и сумма)
 */
export interface IOrderData {
  items: string[]; // массив идентификаторов товаров в заказе
  total: number; // общая стоимость заказа
}

/**
 * Тип, описывающий полные данные заказа для отправки на сервер.
 * Объединяет данные покупателя и информацию о заказе.
 */
export type TOrder = IOrderData & IBuyer;

/**
 * Интерфейс, описывающий ответ сервера при запросе списка товаров
 */
export interface IProductListResponse {
  items: IProduct[]; // массив товаров, полученных с сервера
}

/**
 * Интерфейс, описывающий ответ сервера при успешном оформлении заказа
 */
export interface IOrderResponse {
  id: string; // уникальный идентификатор созданного заказа
  total: number; // общая стоимость заказа
}
