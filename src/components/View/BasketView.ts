import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Интерфейс данных для отображения корзины
 */
interface IBasketView {
  /**
   * @type {number} - общая стоимость товаров в корзине
   */
  total: number;

  /**
   * @type {HTMLElement[]} - список элементов товаров для отображения в корзине
   */
  items: HTMLElement[];
}

/**
 * Класс представления корзины товаров
 * Отображает список товаров в корзине и общую стоимость
 */
export class BasketView extends Component<IBasketView> {
  /**
   * @type {HTMLElement} - список товаров в корзине
   */
  protected _list: HTMLElement;

  /**
   * @type {HTMLElement} - элемент общей стоимости товаров
   */
  protected _total: HTMLElement;

  /**
   * @type {HTMLButtonElement} - кнопка оформления заказа
   */
  protected _checkoutButton: HTMLButtonElement;

  /**
   * @type {HTMLElement | null} - сообщение "Корзина пуста"
   */
  protected _emptyMessage: HTMLElement | null;

  /**
   * @type {IEvents} - брокер событий для генерации событий
   */
  protected events: IEvents;

  /**
   * Создает экземпляр корзины товаров
   * @param {HTMLElement} container - корневой DOM-элемент корзины
   * @param {IEvents} events - брокер событий для генерации событий
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    // Инициализация элементов корзины
    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._total = ensureElement<HTMLElement>(".basket__price", container);
    this._checkoutButton = ensureElement<HTMLButtonElement>(".basket__button", container);
    this._emptyMessage = container.querySelector(".basket__empty-message") || null;

    // Установка обработчика на кнопку оформления
    this._checkoutButton.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  /**
   * Устанавливает список товаров в корзине
   * @param {HTMLElement[]} items - массив DOM-элементов товаров
   */
  setItems(items: HTMLElement[]): void {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.toggleEmptyMessage(false);
    } else {
      this._list.innerHTML = "";
      this.toggleEmptyMessage(true);
    }
  }

  /**
   * Устанавливает общую стоимость товаров в корзине
   * @param {number} total - общая стоимость товаров
   */
  setTotal(total: number): void {
    this._total.textContent = `${total} синапсов`;
  }

  /**
   * Активирует/деактивирует кнопку оформления заказа
   * @param {boolean} enable - true для активации кнопки, false для деактивации
   */
  toggleCheckoutButton(enable: boolean): void {
    this._checkoutButton.disabled = !enable;
  }

  /**
   * Очищает корзину
   */
  clear(): void {
    this._list.innerHTML = "";
    this.toggleEmptyMessage(true);
    this._total.textContent = "0 синапсов";
    this._checkoutButton.disabled = true;
    this.events.emit("basket:clear");
  }

  /**
   * Переключает отображение сообщения "Корзина пуста"
   * @param {boolean} show - true для показа сообщения, false для скрытия
   */
  private toggleEmptyMessage(show: boolean): void {
    if (this._emptyMessage) {
      this._emptyMessage.style.display = show ? "block" : "none";
    }
  }

  // Сеттеры для совместимости с Component.render()
  set items(items: HTMLElement[]) {
    this.setItems(items);
  }

  set total(total: number) {
    this.setTotal(total);
  }

  set buttonState(state: boolean) {
    this.toggleCheckoutButton(state);
  }
}
