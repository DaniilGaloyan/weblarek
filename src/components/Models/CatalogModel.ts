import { IProduct } from "../../types";

/**
 * Класс модели данных для хранения каталога товаров
 * Отвечает за управление списком товаров и выбранным товаром
 */
export class CatalogModel {
  /**
   * @type {IProduct[]} - массив всех товаров каталога
   */
  private _items: IProduct[] = [];

  /**
   * @type {IProduct | null} - товар, выбранный для детального просмотра
   */
  private _selectedItem: IProduct | null = null;

  /**
   * Сохраняет массив товаров в каталог
   * @param {IProduct[]} items - массив товаров для сохранения
   * @returns {void}
   */
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  /**
   * Возвращает все товары каталога
   * @returns {void} - массив товаров
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Находит товар по его идентификатору
   * @param {string} id - идентификатор товара
   * @returns {IProduct | undefined} - найденный товар или undefined
   */
  getItemById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  /**
   * Сохраняет товар для детального просмотра
   * @param {IProduct} item - товар для сохранения
   * @returns {void}
   */
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
  }

  /**
   * Возвращает выбранный товар
   * @returns {IProduct | null} - выбранный товар или null
   */
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
