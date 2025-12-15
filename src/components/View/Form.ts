import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

/**
 * Абстрактный интерфейс для событий форм
 * Отделен от конкретной реализации EventEmitter для соблюдения инверсии зависимостей
 */
export interface IFormEvents {
  /**
   * Генерирует событие с данными
   * @param {string} event - название события
   * @param {T} [data] - данные события
   */
  emit<T extends object>(event: string, data?: T): void;
}

/**
 * Абстрактный класс формы
 * Является базовым классом для всех форм в приложении
 */
export abstract class Form<T> extends Component<T> {
  /**
   * @type {HTMLFormElement} - корневой элемент формы
   */
  protected container: HTMLFormElement;

  /**
   * @type {IFormEvents} - абстрактный интерфейс для генерации событий
   */
  protected events: IFormEvents;

  /**
   * @type {HTMLButtonElement} - кнопка отправки формы
   */
  protected _submitButton: HTMLButtonElement;

  /**
   * @type {HTMLElement} - контейнер для отображения ошибок
   */
  protected _errorContainer: HTMLElement;

  /**
   * @type {Map<string, HTMLInputElement>} - коллекция полей ввода формы
   */
  protected _inputs: Map<string, HTMLInputElement>;

  /**
   * Создает экземпляр формы
   * @param {HTMLFormElement} container - корневой DOM-элемент формы
   * @param {IFormEvents} events - абстрактный интерфейс для генерации событий
   */
  constructor(container: HTMLFormElement, events: IFormEvents) {
    super(container);
    this.container = container;
    this.events = events;

    // Инициализация элементов формы
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errorContainer = ensureElement<HTMLElement>(".form__errors", container);
    this._inputs = new Map();

    // Находим все поля ввода
    const inputElements =
      container.querySelectorAll<HTMLInputElement>("input[name]");
    inputElements.forEach((input) => {
      if (input.name) {
        this._inputs.set(input.name, input);
      }
    });

    // Обработчик отправки формы
    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  /**
   * Абстрактный метод настройки обработчиков событий
   * Должен быть реализован в дочерних классах
   */
  protected abstract setupEventHandlers(): void;

  /**
   * Абстрактный метод обработки отправки формы
   * Должен быть реализован в дочерних классах
   */
  protected abstract onSubmit(): void;

  /**
   * Активирует/деактивирует кнопку отправки
   * @param {boolean} enable - true для активации кнопки, false для деактивации
   */
  protected toggleSubmitButton(enable: boolean): void {
    this._submitButton.disabled = !enable;
  }

  /**
   * Отображает ошибки валидации
   * @param {Record<string, string>} errors - объект с ошибками валидации
   */ 
  protected setErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter((msg) => msg !== "");

    if (errorMessages.length === 0) {
      this._errorContainer.textContent = "";
    } else {
      this._errorContainer.textContent = errorMessages.join(". ");
    }
  }

  /**
   * Очищает отображение ошибок
   */
  protected clearErrors(): void {
    this._errorContainer.textContent = "";
  }

  /**
   * Устанавливает ошибки валидации, полученные из модели
   * @param {Record<string, string>} errors - объект с ошибками валидации
   */
  setValidationErrors(errors: Record<string, string>): void {
    if (Object.keys(errors).length === 0) {
      this.clearErrors();
    } else {
      this.setErrors(errors);
    }
  }

  /**
   * Активирует/деактивирует кнопку отправки (публичный метод)
   * @param {boolean} enabled - true для активации кнопки
   */
  setSubmitEnabled(enabled: boolean): void {
    this.toggleSubmitButton(enabled);
  }

  /**
   * Возвращает корневой элемент формы
   * @returns {HTMLFormElement} - корневой DOM-элемент формы
   */
  getContainer(): HTMLFormElement {
    return this.container;
  }

  /**
   * Сбрасывает состояние touched полей
   * Может быть переопределен в дочерних классах
   */
  resetTouched(): void {
    // Базовая реализация пустая
    // Дочерние классы должны переопределить если нужно
  }
}