import { IBuyer, TPayment } from "../../types";

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
   * Сохраняет данные покупателя (можно передать как все поля, так и часть)
   * @param {Partial<IBuyer>} data - данные покупателя для сохранения
   * @returns {void}
   */
  setData(data: Partial<IBuyer>): void {
    this._data = { ...this._data, ...data };
  }

  /**
   * Возвращает все сохранённые данные покупателя
   * @returns {Partial<IBuyer>} - данные покупателя
   */
  getData(): Partial<IBuyer> {
    return { ...this._data };
  }

  /**
   * Очищает все данные покупателя
   * @returns {void}
   */
  clear(): void {
    this._data = {};
  }

  /**
   * Проверяет валидность данных покупателя.
   * @returns {Record<keyof IBuyer, string> | null} - объект с ошибками (для невалидных полей) или null (все данные корректны)
   */
  validate(): Record<keyof IBuyer, string> | null {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const { payment, email, phone, address } = this._data;

    // Проверка способа оплаты
    if (!payment) {
      errors.payment = "Не выбран способ оплаты";
    } else if (!this.isValidPayment(payment)) {
      errors.payment = "Некорректный способ оплаты";
    }

    // Проверка email
    if (!email || email.trim() === "") {
      errors.email = "Укажите email";
    }

    // Проверка телефона
    if (!phone || phone.trim() === "") {
      errors.phone = "Укажите телефон";
    }

    // Проверка адреса
    if (!address || address.trim() === "") {
      errors.address = "Укажите адрес доставки";
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
}
