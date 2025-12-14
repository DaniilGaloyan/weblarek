import { Component } from "../base/Component";

/**
 * Интерфейс данных для отображения каталога товаров
 */
interface ICatalogView {
  /**
   * @type {HTMLElement[]} - массив карточек товаров для отображения
   */
  catalog: HTMLElement[];
}

/**
 * Класс представления каталога товаров
 * Отображает галерею товаров на главной странице
 */
export class CatalogView extends Component<ICatalogView> {
  /**
   * @type {HTMLElement} - корневой элемент каталога
   */
  protected container: HTMLElement;
  
  /**
   * @type {HTMLElement[]} - массив карточек товаров в каталоге
   */
  protected _cards: HTMLElement[];

  /**
   * Создает экземпляр каталога товаров
   * @param {HTMLElement} container - корневой DOM-элемент каталога
   */
  constructor(container: HTMLElement) {
    super(container);
    
    // Инициализация элементов каталога
    this.container = container;
    this._cards = [];
  }

  /**
   * Отрисовывает каталог с переданными данными
   * @param {Partial<ICatalogView>} [data] - данные для отображения каталога
   * @returns {HTMLElement} - корневой элемент каталога
   */
  render(data?: Partial<ICatalogView>): HTMLElement {
    if (data?.catalog) {
      this.setItems(data.catalog);
    }
    return this.container;
  }

  /**
   * Устанавливает карточки товаров в каталог
   * @param {HTMLElement[]} items - массив DOM-элементов карточек товаров
   */
  setItems(items: HTMLElement[]): void {
    this.clear();
    items.forEach(item => this.addCard(item));
  }

  /**
   * Добавляет карточку товара в каталог
   * @param {HTMLElement} card - DOM-элемент карточки товара
   */
  addCard(card: HTMLElement): void {
    this.container.appendChild(card);
    this._cards.push(card);
  }

  /**
   * Очищает каталог (удаляет все карточки)
   */
  clear(): void {
    this.container.innerHTML = '';
    this._cards = [];
  }

  /**
   * Сеттер для совместимости с Component.render()
   * @param {HTMLElement[]} catalog - массив DOM-элементов карточек товаров
   */
  set catalog(catalog: HTMLElement[]) {
    this.setItems(catalog);
  }
}