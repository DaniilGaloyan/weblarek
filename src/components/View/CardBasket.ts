import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Card";

/**
 * Тип данных для карточки товара в корзине
 * Используется для отображения товара в списке корзины
 */
export type TCardBasket = Pick<IProduct, "id" | "title" | "price"> & {
  /**
   * @type {number} - порядковый номер товара в корзине
   */
  index: number;
};

/**
 * Класс представления карточки товара для корзины
 * Отображает товар в списке корзины с возможностью удаления
 */
export class CardBasket extends Card<TCardBasket> {
  /**
   * @type {HTMLElement} - элемент порядкового номера товара
   */
  protected _index: HTMLElement;

  /**
   * @type {HTMLButtonElement} - кнопка удаления товара из корзины
   */
  protected _button: HTMLButtonElement;

  /**
   * Создает экземпляр карточки товара для корзины
   * @param {HTMLElement} container - корневой DOM-элемент карточки
   * @param {ICardActions} [actions] - опциональные обработчики событий
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    // Инициализация элементов карточки
    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._button = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    // Установка обработчика клика на кнопку удаления
    if (actions?.onButtonClick && this._button) {
      this._button.addEventListener("click", actions.onButtonClick);
    }
  }

  /**
   * Устанавливает порядковый номер товара
   * @param {number} value - порядковый номер товара в корзине
   */
  set index(value: number) {
    this._index.textContent = String(value);
  }
}
