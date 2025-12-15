import { ensureElement } from "../../utils/utils";
import { Form, IFormEvents } from "./Form";
import { OrderSubmitEvent, PaymentSelectedEvent, OrderFieldChangedEvent } from "../../types";

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
   * @type {Set<string>} - множество полей, с которыми пользователь взаимодействовал
   */
  private _touchedFields: Set<string> = new Set();

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

    // Настраиваем обработчики событий
    this.setupEventHandlers();
  }

  /**
   * Настраивает обработчики событий
   */
  protected setupEventHandlers(): void {
    // Настройка обработчиков для кнопок оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._touchedFields.add("payment");
        this.events.emit<PaymentSelectedEvent>("payment:selected", { payment: button.name });
      });
    });

    // Настройка обработчиков для поля адреса
    this._addressInput.addEventListener("input", () => {
      this._touchedFields.add("address");
      this.events.emit<OrderFieldChangedEvent>("order:field-changed", { 
        field: "address", 
        value: this._addressInput.value 
      });
    });

    // При потере фокуса отмечаем как touched только если было введено значение
    this._addressInput.addEventListener("blur", () => {
      if (this._addressInput.value.trim() !== "") {
        this._touchedFields.add("address");
        this.events.emit<OrderFieldChangedEvent>("order:field-changed", {
          field: "address",
          value: this._addressInput.value
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
    this.events.emit<OrderSubmitEvent>("order:submit", {
      payment: this._selectedPayment,
      address: this._addressInput.value,
    });
  }

  /**
   * Устанавливает способ оплаты (вызывается извне, из презентера)
   * @param {string} payment - способ оплаты ('card', 'cash' или пустая строка)
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
  }

  /**
   * Устанавливает ошибки валидации, полученные из модели
   * @param {Record<string, string>} errors - объект с ошибками валидации
   */
  setValidationErrors(errors: Record<string, string>): void {
    const filteredErrors: Record<string, string> = {};
    
    // Показываем ошибки только для touched полей
    if (errors.payment && this._touchedFields.has("payment")) {
      filteredErrors.payment = errors.payment;
    }
    
    if (errors.address && this._touchedFields.has("address")) {
      filteredErrors.address = errors.address;
    }
    
    if (Object.keys(filteredErrors).length === 0) {
      this.clearErrors();
    } else {
      this.setErrors(filteredErrors);
    }
  }

  /**
   * Сбрасывает состояние touched полей
   */
  resetTouched(): void {
    this._touchedFields.clear();
  }

  // Сеттер для совместимости
  set payment(payment: string) {
    this.setPayment(payment);
  }
}