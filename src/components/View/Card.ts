import { Component } from "../base/Component";

/**
 * Интерфейс обработчиков событий для карточек товара
 */
export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onButtonClick?: (event: MouseEvent) => void;
}

/**
 * Абстрактный класс карточки товара
 * Является базовым классом для всех типов карточек товара
 */
export abstract class Card<T> extends Component<T> {
  /**
   * @type {HTMLElement | undefined} - элемент категории товара
   */
  protected _category?: HTMLElement;

  /**
   * @type {HTMLElement | undefined} - элемент названия товара
   */
  protected _title?: HTMLElement;

  /**
   * @type {HTMLImageElement | undefined} - элемент изображения товара
   */
  protected _image?: HTMLImageElement;

  /**
   * @type {HTMLElement | undefined} - элемент цены товара
   */
  protected _price?: HTMLElement;

  /**
   * @type {HTMLButtonElement | undefined} - кнопка действия (добавить/удалить из корзины)
   */
  protected _button?: HTMLButtonElement;

  /**
   * Создает экземпляр карточки товара
   * @param {HTMLElement} container - корневой DOM-элемент карточки
   * @param {ICardActions} [actions] - опциональные обработчики событий карточки
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Инициализация элементов карточки
    this._category = container.querySelector(".card__category") ?? undefined;
    this._title = container.querySelector(".card__title") ?? undefined;
    this._image = container.querySelector<HTMLImageElement>(".card__image") ?? undefined;
    this._price = container.querySelector(".card__price") ?? undefined;
    this._button = container.querySelector<HTMLButtonElement>(".card__button") ?? undefined;

    // Установка обработчиков событий
    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }

    if (actions?.onButtonClick && this._button) {
      this._button.addEventListener("click", actions.onButtonClick);
    }
  }

  /**
   * Устанавливает категорию товара
   * @param {string} value - название категории
   */
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
    }
  }

  /**
   * Устанавливает название товара
   * @param {string} value - название товара
   */
  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  /**
   * Устанавливает изображение товара
   * @param {string} value - URL изображения
   */
  set image(value: string) {
    if (this._image) {
      const alt = this._title?.textContent || "";
      this.setImage(this._image, value, alt);
    }
  }

  /**
   * Устанавливает цену товара
   * @param {number | null} value - цена товара (null для бесплатного товара)
   */
  set price(value: number | null) {
    if (this._price) {
      this._price.textContent =
        value === null ? "Бесценно" : `${value} синапсов`;
    }
  }

  /**
   * Устанавливает текст кнопки
   * @param {string} value - текст кнопки
   */
  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  /**
   * Устанавливает состояние кнопки (активна/неактивна)
   * @param {boolean} value - true для отключения кнопки
   */
  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}