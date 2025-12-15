import { ensureElement } from "../../utils/utils";
import { Form, IFormEvents } from "./Form";
import { ContactsSubmitEvent, ContactsFieldChangedEvent } from "../../types";

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
   * @type {Set<string>} - множество полей, с которыми пользователь взаимодействовал
   */
  private _touchedFields: Set<string> = new Set();

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

    // Настраиваем обработчики событий для полей ввода
    this.setupEventHandlers();
  }

  /**
   * Настраивает обработчики событий для полей ввода
   */
  protected setupEventHandlers(): void {
    // При изменении email эмитим событие
    this._emailInput.addEventListener("input", () => {
      this._touchedFields.add("email");
      this.events.emit<ContactsFieldChangedEvent>("contacts:field-changed", { 
        field: "email", 
        value: this._emailInput.value 
      });
    });

    // При изменении телефона эмитим событие
    this._phoneInput.addEventListener("input", () => {
      this._touchedFields.add("phone");
      this.events.emit<ContactsFieldChangedEvent>("contacts:field-changed", { 
        field: "phone", 
        value: this._phoneInput.value 
      });
    });

    // При потере фокуса отмечаем как touched только если было введено значение
    this._emailInput.addEventListener("blur", () => {
      if (this._emailInput.value.trim() !== "") {
        this._touchedFields.add("email");
        this.events.emit<ContactsFieldChangedEvent>("contacts:field-changed", {
          field: "email",
          value: this._emailInput.value
        });
      }
    });

    this._phoneInput.addEventListener("blur", () => {
      if (this._phoneInput.value.trim() !== "") {
        this._touchedFields.add("phone");
        this.events.emit<ContactsFieldChangedEvent>("contacts:field-changed", {
          field: "phone",
          value: this._phoneInput.value
        });
      }
    });
  }

  /**
   * Обрабатывает отправку формы
   */
  protected onSubmit(): void {
    // Эмитим событие отправки формы
    // Валидация будет происходить в BuyerModel через презентер
    this.events.emit<ContactsSubmitEvent>("contacts:submit", {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    });
  }

  /**
   * Устанавливает ошибки валидации, полученные из модели
   * @param {Record<string, string>} errors - объект с ошибками валидации
   */
  setValidationErrors(errors: Record<string, string>): void {
    const filteredErrors: Record<string, string> = {};
    
    // Показываем ошибки только для touched полей
    if (errors.email && this._touchedFields.has("email")) {
      filteredErrors.email = errors.email;
    }
    
    if (errors.phone && this._touchedFields.has("phone")) {
      filteredErrors.phone = errors.phone;
    }
    
    if (Object.keys(filteredErrors).length === 0) {
      this.clearErrors();
    } else {
      this.setErrors(filteredErrors);
    }
  }

  /**
   * Устанавливает email
   * @param {string} email - адрес электронной почты
   */
  set email(email: string) {
    this._emailInput.value = email;
  }

  /**
   * Устанавливает телефон
   * @param {string} phone - номер телефона
   */
  set phone(phone: string) {
    this._phoneInput.value = phone;
  }

  /**
   * Сбрасывает состояние touched полей
   */
  resetTouched(): void {
    this._touchedFields.clear();
  }
}