import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Класс модели данных для хранения и валидации данных покупателя
 * Отвечает за управление данными покупателя при оформлении заказа
 */
export class BuyerModel {
  /**
   * @type {Partial<IBuyer>} - объект с данными покупателя (может быть частично заполнен)
   */
  private _data: Partial<IBuyer> = {};

  /**
   * @type {IEvents} - брокер событий
   */
  private events: IEvents;

  /**
   * Создает экземпляр модели данных покупателя
   * @param {IEvents} events - брокер событий
   */
  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Сохраняет данные покупателя и генерирует событие
   * @param {Partial<IBuyer>} data - данные покупателя для сохранения
   * @returns {void}
   */
  setData(data: Partial<IBuyer>): void {
    this._data = { ...this._data, ...data };
    this.events.emit<{ data: Partial<IBuyer> }>('buyer:changed', { data: this._data });
  }

  /**
   * Возвращает все сохранённые данные покупателя
   * @returns {Partial<IBuyer>} - данные покупателя
   */
  getData(): Partial<IBuyer> {
    return { ...this._data };
  }

  /**
   * Очищает все данные покупателя и генерирует событие
   * @returns {void}
   */
  clear(): void {
    this._data = {};
    this.events.emit<{ data: Partial<IBuyer> }>('buyer:changed', { data: this._data });
  }

  /**
   * Проверяет валидность данных покупателя.
   * @param {Array<keyof IBuyer>} [fields] - опциональный массив полей для проверки
   * @returns {Record<keyof IBuyer, string> | null} - объект с ошибками или null
   */
  validate(fields?: Array<keyof IBuyer>): Record<keyof IBuyer, string> | null {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const { payment, email, phone, address } = this._data;

    // Определяем какие поля проверять
    const fieldsToValidate = fields || ['payment', 'email', 'phone', 'address'];

    // Проверка способа оплаты
    if (fieldsToValidate.includes('payment')) {
      if (!payment) {
        errors.payment = "Не выбран способ оплаты";
      } else if (!this.isValidPayment(payment)) {
        errors.payment = "Некорректный способ оплаты";
      }
    }

    // Проверка email
    if (fieldsToValidate.includes('email')) {
      if (!email || email.trim() === "") {
        errors.email = "Укажите email";
      } else if (!this.isValidEmail(email)) {
        errors.email = "Некорректный формат email";
      }
    }

    // Проверка телефона
    if (fieldsToValidate.includes('phone')) {
      if (!phone || phone.trim() === "") {
        errors.phone = "Укажите телефон";
      } else if (!this.isValidPhone(phone)) {
        errors.phone = "Некорректный формат телефона";
      }
    }

    // Проверка адреса
    if (fieldsToValidate.includes('address')) {
      if (!address || address.trim() === "") {
        errors.address = "Укажите адрес доставки";
      }
    }

    // Если есть ошибки, возвращаем объект с ними, иначе возвращаем null
    return Object.keys(errors).length > 0
      ? (errors as Record<keyof IBuyer, string>)
      : null;
  }

  /**
   * Проверяет, является ли значение корректным способом оплаты
   * @param {string} value - проверяемое значение
   * @returns {value is TPayment} - true, если значение корректно
   */
  private isValidPayment(value: string): value is TPayment {
    return value === "card" || value === "cash";
  }

  /**
   * Проверяет, является ли значение корректным email
   * @param {string} email - проверяемый email
   * @returns {boolean} - true, если email корректный
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Проверяет, является ли значение корректным телефоном
   * @param {string} phone - проверяемый телефон
   * @returns {boolean} - true, если телефон корректный
   */
  private isValidPhone(phone: string): boolean {
    // Простая проверка российских телефонов
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  /**
   * Проверяет, заполнены ли поля для первого шага заказа
   * @returns {boolean} - true если все поля заполнены
   */
  isOrderStepComplete(): boolean {
    const { payment, address } = this._data;
    const isPaymentSelected = payment && (payment === "card" || payment === "cash");
    const isAddressFilled = address && address.trim() !== "";
    return Boolean(isPaymentSelected && isAddressFilled);
  }

  /**
   * Проверяет, заполнены ли поля для второго шага заказа
   * @returns {boolean} - true если все поля заполнены
   */
  isContactsStepComplete(): boolean {
    const { email, phone } = this._data;
    const isEmailFilled = email && email.trim() !== "";
    const isPhoneFilled = phone && phone.trim() !== "";
    return Boolean(isEmailFilled && isPhoneFilled);
  }
}
