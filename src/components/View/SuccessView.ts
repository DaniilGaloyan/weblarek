import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Интерфейс данных для отображения успешного оформления заказа
 */
interface ISuccessView {
  /**
   * @type {number} - общая сумма заказа
   */
  total: number;
}

/**
 * Класс представления сообщения об успешном оформлении заказа
 * Отображает информацию о завершенном заказе
 */
export class SuccessView extends Component<ISuccessView> {
  /**
   * @type {IEvents} - брокер событий для генерации событий
   */
  protected events: IEvents;
  
  /**
   * @type {HTMLElement} - заголовок сообщения
   */
  protected _title: HTMLElement;
  
  /**
   * @type {HTMLElement} - элемент описания с суммой заказа
   */
  protected _description: HTMLElement;
  
  /**
   * @type {HTMLButtonElement} - кнопка закрытия сообщения
   */
  protected _closeButton: HTMLButtonElement;

  /**
   * Создает экземпляр сообщения об успешном оформлении заказа
   * @param {HTMLElement} container - корневой DOM-элемент сообщения
   * @param {IEvents} events - брокер событий для генерации событий
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    // Инициализация элементов сообщения
    this._title = ensureElement<HTMLElement>('.order-success__title', container);
    this._description = ensureElement<HTMLElement>('.order-success__description', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    // Установка обработчика на кнопку закрытия
    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  /**
   * Отрисовывает сообщение с переданными данными
   * @param {Partial<ISuccessView>} data - данные для отображения сообщения
   * @returns {HTMLElement} - корневой элемент сообщения
   */
  render(data?: Partial<ISuccessView>): HTMLElement {
    if (data?.total !== undefined) {
      this.setTotal(data.total);
    }
    return this.container;
  }

  /**
   * Устанавливает сумму заказа в описании
   * @param {number} total - общая сумма заказа
   */
  setTotal(total: number): void {
    this._description.textContent = `Списано ${total} синапсов`;
  }

  /**
   * Сеттер для совместимости с Component.render()
   * @param {number} total - общая сумма заказа
   */
  set total(total: number) {
    this.setTotal(total);
  }
}