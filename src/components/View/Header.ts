import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Интерфейс данных для отображения шапки сайта
 */
interface IHeader {
  /**
   * @type {number} - количество товаров в корзине для отображения в счетчике
   */
  counter: number;
}

/**
 * Класс представления шапки сайта
 * Отображает логотип и иконку корзины с счетчиком товаров
 */
export class Header extends Component<IHeader> {
  /**
   * @type {HTMLElement} - элемент счетчика товаров в корзине
   */
  protected _counterElement: HTMLElement;

  /**
   * @type {HTMLButtonElement} - кнопка корзины
   */
  protected _basketButton: HTMLButtonElement;

  /**
   * Создает экземпляр шапки сайта
   * @param {HTMLElement} container - корневой DOM-элемент шапки
   * @param {IEvents} events - брокер событий для генерации событий
   */
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов шапки
    this._counterElement = ensureElement<HTMLElement>(".header__basket-counter", container);
    this._basketButton = ensureElement<HTMLButtonElement>(".header__basket", container);

    // Установка обработчика клика на кнопку корзины
    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  /**
   * Устанавливает значение счетчика товаров в корзине
   * @param {number} value - количество товаров в корзине
   */
  set counter(value: number) {
    this._counterElement.textContent = String(value);
  }
}
