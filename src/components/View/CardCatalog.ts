import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { Card, ICardActions } from "./Card";

type CategoryKey = keyof typeof categoryMap;

/**
 * Тип данных для карточки товара в каталоге
 * Используется для отображения товара в галерее
 */
export type TCardCatalog = Pick<IProduct, "id" | "image" | "category" | "title" | "price">;

/**
 * Класс представления карточки товара для каталога
 * Отображает товар в галерее на главной странице
 */
export class CardCatalog extends Card<TCardCatalog> {
  /**
   * Создает экземпляр карточки товара для каталога
   * @param {HTMLElement} container - корневой DOM-элемент карточки
   * @param {ICardActions} [actions] - опциональные обработчики событий
   */
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  /**
   * Устанавливает категорию товара и применяет соответствующий CSS-класс
   * @param {string} value - название категории товара
   */
  set category(value: string) {
    if (this._category) {
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
  }

  /**
   * Устанавливает изображение товара
   * @param {string} value - URL изображения товара
   */
  set image(value: string) {
    if (this._image) {
      const alt = this._title?.textContent || "";
      this.setImage(this._image, value, alt);
    }
  }
}
