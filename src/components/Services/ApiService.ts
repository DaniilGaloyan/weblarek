import {
  IApi,
  IProduct,
  TOrder,
  IProductListResponse,
  IOrderResponse,
} from "../../types";

/**
 * Класс сервиса для взаимодействия с API сервера.
 * Отвечает за получение данных с сервера и отправку данных на сервер.
 */
export class ApiService {
  /**
   * @type {IApi} - экземпляр API-клиента для выполнения запросов
   */
  private _api: IApi;

  /**
   * Создает экземпляр ApiService
   * @param {IApi} api - экземпляр класса, реализующего интерфейс IApi
   */
  constructor(api: IApi) {
    this._api = api;
  }

  /**
   * Получает список товаров с сервера
   * @returns {Promise<IProduct[]>} - промис с массивом товаров
   */
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this._api.get<IProductListResponse>("/product");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении списка товаров:", error);
      throw error;
    }
  }

  /**
   * Отправляет данные заказа на сервер
   * @param {TOrder} order - данные заказа для отправки
   * @returns {Promise<IOrderResponse>} - промис с ответом сервера
   */
  async createOrder(order: TOrder): Promise<IOrderResponse> {
    try {
      const response = await this._api.post<IOrderResponse>("/order", order);
      return response;
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      throw error;
    }
  }
}
