import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Card";

type CategoryKey = keyof typeof categoryMap;

/**
 * Тип данных для карточки товара в просмотре
 * Используется для отображения детальной информации о товаре
 */
export type TCardPreview = IProduct;

/**
 * Класс представления карточки товара для детального просмотра
 * Отображает полную информацию о товаре в модальном окне
 */
export class CardPreview extends Card<TCardPreview> {
  /**
   * @type {HTMLElement} - элемент описания товара
   */
  protected _description: HTMLElement;

  /**
   * @type {HTMLElement} - элемент категории товара
   */
  protected _category: HTMLElement;

  /**
   * @type {HTMLImageElement} - элемент изображения товара
   */
  protected _image: HTMLImageElement;

  /**
   * @type {HTMLButtonElement} - кнопка действия (добавить/удалить из корзины)
   */
  protected _button: HTMLButtonElement;

  /**
   * Создает экземпляр карточки товара для просмотра
   * @param {HTMLElement} container - корневой DOM-элемент карточки
   * @param {ICardActions} [actions] - опциональные обработчики событий
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    // Инициализация элементов карточки
    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    // Установка обработчика клика на кнопку
    if (actions?.onButtonClick && this._button) {
      this._button.addEventListener("click", actions.onButtonClick);
    }
  }

  /**
   * Устанавливает категорию товара и применяет соответствующий CSS-класс
   * @param {string} value - название категории товара
   */
  set category(value: string) {
    this._category.textContent = value;

    // Удаляем все существующие классы категорий
    for (const key in categoryMap) {
      this._category.classList.remove(categoryMap[key as CategoryKey]);
    }

    // Добавляем соответствующий класс для категории
    for (const key in categoryMap) {
      if (key === value) {
        this._category.classList.add(categoryMap[key as CategoryKey]);
      }
    }
  }

  /**
   * Устанавливает описание товара
   * @param {string} value - описание товара
   */
  set description(value: string) {
    this._description.textContent = value;
  }

  /**
   * Устанавливает изображение товара
   * @param {string} value - URL изображения товара
   */
  set image(value: string) {
    const alt = this._title?.textContent || "";
    this.setImage(this._image, value, alt);
  }
}
