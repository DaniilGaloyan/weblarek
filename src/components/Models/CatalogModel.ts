import { IProduct, CatalogChangedEvent, SelectedItemChangedEvent } from "../../types";
import { IEvents } from "../base/Events";

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
   * @type {IEvents} - брокер событий
   */
  private events: IEvents;

  /**
   * Создает экземпляр модели каталога товаров
   * @param {IEvents} events - брокер событий
   */
  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Сохраняет массив товаров в каталог и генерирует событие
   * @param {IProduct[]} items - массив товаров для сохранения
   * @returns {void}
   */
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit<CatalogChangedEvent>("catalog:changed", {
      items: this._items,
    });
  }

  /**
   * Возвращает все товары каталога
   * @returns {IProduct[]} - массив товаров
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
   * Сохраняет товар для детального просмотра и генерирует событие
   * @param {IProduct} item - товар для сохранения
   * @returns {void}
   */
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit<SelectedItemChangedEvent>("selectedItem:changed", {
      selectedItem: this._selectedItem,
    });
  }

  /**
   * Возвращает выбранный товар
   * @returns {IProduct | null} - выбранный товар или null
   */
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
