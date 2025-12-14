import { ensureElement } from "../../utils/utils";
import { Form, IFormEvents } from "./Form";

/**
 * Интерфейс данных для отображения формы первого шага оформления заказа
 */
interface IOrderForm {
  /**
   * @type {string} - выбранный способ оплаты ('card' или 'cash')
   */
  payment: string;

  /**
   * @type {string} - адрес доставки
   */
  address: string;
}

/**
 * Класс представления формы первого шага оформления заказа
 * Отображает выбор способа оплаты и поле для адреса доставки
 */
export class OrderForm extends Form<IOrderForm> {
  /**
   * @type {NodeListOf<HTMLButtonElement>} - кнопки выбора способа оплаты
   */
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;

  /**
   * @type {HTMLInputElement} - поле ввода адреса доставки
   */
  protected _addressInput: HTMLInputElement;

  /**
   * @type {string} - текущий выбранный способ оплаты
   */
  protected _selectedPayment: string = "";

  /**
   * Создает экземпляр формы оформления заказа
   * @param {HTMLFormElement} container - корневой DOM-элемент формы
   * @param {IFormEvents} events - абстрактный интерфейс для генерации событий
   */
  constructor(container: HTMLFormElement, events: IFormEvents) {
    // Сначала находим элементы
    const paymentButtons = container.querySelectorAll<HTMLButtonElement>("button[name]");
    const addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    // Потом вызываем конструктор родителя
    super(container, events);

    // Теперь инициализируем поля (после super)
    this._paymentButtons = paymentButtons;
    this._addressInput = addressInput;

    // Настраиваем валидацию после инициализации всех полей
    this.setupValidation();
  }

  /**
   * Настраивает валидацию формы
   */
  protected setupValidation(): void {
    // Настройка обработчиков для кнопок оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setPayment(button.name);
        this.events.emit("payment:selected", { payment: button.name });
        this.validate();
      });
    });

    // Настройка валидации поля адреса
    this._addressInput.addEventListener("input", () => {
      this.validate();
    });
  }

  /**
   * Проверяет валидность формы
   * @returns {boolean} - true если форма валидна
   */
  protected validate(): boolean {
    const isValid = this._selectedPayment !== "" && this._addressInput.value.trim() !== "";

    if (!isValid) {
      const errors: Record<string, string> = {};

      if (this._selectedPayment === "") {
        errors.payment = "выбрать способ оплаты";
      }
        
      if (this._addressInput.value.trim() === "") {
        errors.address = "указать адрес";
      }

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
      this.events.emit("order:submit", {
        payment: this._selectedPayment,
        address: this._addressInput.value,
      });
    }
  }

  /**
   * Устанавливает способ оплаты
   * @param {string} payment - способ оплаты ('card' или 'cash')
   */
  setPayment(payment: string): void {
    this._selectedPayment = payment;

    // Обновляем стили кнопок
    this._paymentButtons.forEach((button) => {
      if (button.name === payment) {
        button.classList.add("button_alt-active");
        button.classList.remove("button_alt");
      } else {
        button.classList.add("button_alt");
        button.classList.remove("button_alt-active");
      }
    });
  }

  /**
   * Устанавливает адрес доставки
   * @param {string} address - адрес доставки
   */
  set address(address: string) {
    this._addressInput.value = address;
    this.validate();
  }

  /**
   * Устанавливает способ оплаты (сеттер для совместимости)
   * @param {string} payment - способ оплаты ('card' или 'cash')
   */
  set payment(payment: string) {
    this.setPayment(payment);
    this.validate();
  }  
}