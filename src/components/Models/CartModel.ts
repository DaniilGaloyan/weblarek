import { IProduct, CartChangedEvent } from "../../types";
import { IEvents } from "../base/Events";


/**
 * Класс модели данных для хранения корзины покупок.
 * Отвечает за управление товарами в корзине.
 */ 
export class CartModel {
  /**
   * @type {IProduct[]} - массив товаров в корзине
   */
  private _items: IProduct[] = [];

  /**
   * @type {IEvents} - брокер событий
   */
  private events: IEvents;

  /**
   * Создает экземпляр модели корзины покупок
   * @param {IEvents} events - брокер событий
   */
  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Возвращает все товары в корзине
   * @returns {IProduct[]} - массив товаров в корзине
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Добавляет товар в корзину и генерирует событие
   * @param {IProduct} item - товар для добавления
   * @returns {void}
   */
  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit<CartChangedEvent>('cart:changed', { items: this._items });
  }

  /**
   * Удаляет товар из корзины по его идентификатору и генерирует событие
   * @param {string} id - идентификатор товара для удаления
   * @returns {void}
   */
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit<CartChangedEvent>('cart:changed', { items: this._items });
  }

  /**
   * Полностью очищает корзину и генерирует событие
   * @returns {void}
   */
  clear(): void {
    this._items = [];
    this.events.emit<CartChangedEvent>('cart:changed', { items: this._items });
  }

  /**
   * Рассчитывает общую стоимость товаров в корзине
   * @returns {number} - общая стоимость
   */
  getTotal(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине
   * @returns {number} - количество товаров
   */
  getCount(): number {
    return this._items.length;
  }

  /**
   * Проверяет, есть ли товар с указанным ID в корзине
   * @param {string} id - идентификатор товара для проверки
   * @returns {boolean} - true, если товар есть в корзине
   */
  contains(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
