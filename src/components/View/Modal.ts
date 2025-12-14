import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Класс представления модального окна
 * Управляет отображением и скрытием модальных окон
 */
export class Modal extends Component<{}> {
  /**
   * @type {HTMLElement} - контейнер для контента модального окна
   */
  protected _content: HTMLElement;

  /**
   * @type {HTMLButtonElement} - кнопка закрытия модального окна
   */
  protected _closeButton: HTMLButtonElement;

  /**
   * Создает экземпляр модального окна
   * @param {HTMLElement} container - корневой DOM-элемент модального окна
   */
  constructor(container: HTMLElement) {
    super(container);

    // Инициализация элементов модального окна
    this._content = ensureElement<HTMLElement>(".modal__content", container);
    this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);

    // Установка обработчиков событий
    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  /**
   * Открывает модальное окно
   */
  open(): void {
    this.container.classList.add("modal_active");
  }

  /**
   * Закрывает модальное окно
   */
  close(): void {
    this.container.classList.remove("modal_active");
  }

  /**
   * Устанавливает содержимое модального окна
   * @param {HTMLElement} content - DOM-элемент для отображения в модальном окне
   */
  setContent(content: HTMLElement): void {
    this._content.innerHTML = "";
    this._content.appendChild(content);
  }
}
