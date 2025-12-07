import { IProduct } from "../../types";

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
   * Возвращает все товары в корзине
   * @returns {IProduct[]} - массив товаров в корзине
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Добавляет товар в корзину
   * @param {IProduct} item - товар для добавления
   * @returns {void}
   */
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  /**
   * Удаляет товар из корзины по его идентификатору
   * @param {string} id - идентификатор товара для удаления
   * @returns {void}
   */
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  /**
   * Полностью очищает корзину
   * @returns {void}
   */
  clear(): void {
    this._items = [];
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
