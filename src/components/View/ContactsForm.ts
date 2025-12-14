import { ensureElement } from "../../utils/utils";
import { Form, IFormEvents } from "./Form";

/**
 * Интерфейс данных для отображения формы контактных данных
 */
interface IContactsForm {
  /**
   * @type {string} - адрес электронной почты
   */
  email: string;

  /**
   * @type {string} - номер телефона
   */
  phone: string;
}

/**
 * Класс представления формы контактных данных
 * Отображает поля для ввода email и телефона
 */
export class ContactsForm extends Form<IContactsForm> {
  /**
   * @type {HTMLInputElement} - поле ввода email
   */
  protected _emailInput: HTMLInputElement;

  /**
   * @type {HTMLInputElement} - поле ввода телефона
   */
  protected _phoneInput: HTMLInputElement;

  /**
   * Создает экземпляр формы контактных данных
   * @param {HTMLFormElement} container - корневой DOM-элемент формы
   * @param {IFormEvents} events - абстрактный интерфейс для генерации событий
   */
  constructor(container: HTMLFormElement, events: IFormEvents) {
    // Находим элементы
    const emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    const phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

    // Вызываем конструктор родителя
    super(container, events);

    // Инициализируем поля
    this._emailInput = emailInput;
    this._phoneInput = phoneInput;

    // Настраиваем валидацию
    this.setupValidation();
  }

  /**
   * Настраивает валидацию формы
   */
  protected setupValidation(): void {
    // Настройка валидации полей при вводе
    this._emailInput.addEventListener("input", () => {
      this.validate();
    });

    this._phoneInput.addEventListener("input", () => {
      this.validate();
    });
  }

  /**
   * Проверяет валидность формы
   * @returns {boolean} - true если форма валидна
   */
  protected validate(): boolean {
    const email = this._emailInput.value.trim();
    const phone = this._phoneInput.value.trim();

    const isEmailValid = this.isValidEmail(email);
    const isPhoneValid = this.isValidPhone(phone);
    const isValid = isEmailValid && isPhoneValid;

    if (!isValid) {
      const errors: Record<string, string> = {};
      if (!isEmailValid) errors.email = "указать корректный email";
      if (!isPhoneValid) errors.phone = "ввести корректный телефон";

      this.setErrors(errors);
      this.events.emit("form:error", { errors });
    } else {
      this.clearErrors();
    }

    this.toggleSubmitButton(isValid);
    return isValid;
  }

  /**
   * Обрабатывает отправку формы
   */
  protected onSubmit(): void {
    if (this.validate()) {
      this.events.emit("contacts:submit", {
        email: this._emailInput.value,
        phone: this._phoneInput.value,
      });
    }
  }

  /**
   * Проверяет валидность email
   * @param {string} email - email для проверки
   * @returns {boolean} - true если email валиден
   */
  protected isValidEmail(email: string): boolean {
    return email !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Проверяет валидность телефона
   * @param {string} phone - телефон для проверки
   * @returns {boolean} - true если телефон валиден
   */
  protected isValidPhone(phone: string): boolean {
    return (
      phone !== "" && /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/.test(phone)
    );
  }
 
  /**
   * Устанавливает email
   * @param {string} email - адрес электронной почты
   */
  set email(email: string) {
    this._emailInput.value = email;
    this.validate();
  }

  /**
   * Устанавливает телефон
   * @param {string} phone - номер телефона
   */
  set phone(phone: string) {
    this._phoneInput.value = phone;
    this.validate();
  }
}