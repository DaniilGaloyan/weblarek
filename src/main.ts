import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/Services/ApiService";
import { API_URL, CDN_URL } from "./utils/constants";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Header } from "./components/View/Header";
import { CatalogView } from "./components/View/CatalogView";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { BasketView } from "./components/View/BasketView";
import { Modal } from "./components/View/Modal";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { SuccessView } from "./components/View/SuccessView";
import { cloneTemplate, ensureElement } from "./utils/utils";
import {
  CardSelectEvent,
  CardButtonClickEvent,
  CatalogChangedEvent,
  BasketRemoveEvent,
  SelectedItemChangedEvent,
  CartChangedEvent,
} from "./types";

/**
 * Класс Презентера - связывает Model и View
 * Отвечает за бизнес-логику приложения
 */
class AppPresenter {
  // Модели
  private catalogModel: CatalogModel;
  private cartModel: CartModel;
  private buyerModel: BuyerModel;

  // Основные представления (постоянные на странице)
  private headerView: Header;
  private catalogView: CatalogView;
  private modalView: Modal;

  // Текущее открытое представление в модальном окне
  private currentBasketView: BasketView | null = null;

  // Сервисы
  private apiService: ApiService;

  // Шаблоны
  private cardCatalogTemplate: HTMLTemplateElement;
  private cardPreviewTemplate: HTMLTemplateElement;
  private cardBasketTemplate: HTMLTemplateElement;
  private basketTemplate: HTMLTemplateElement;
  private orderTemplate: HTMLTemplateElement;
  private contactsTemplate: HTMLTemplateElement;
  private successTemplate: HTMLTemplateElement;

  // Брокер событий
  private events: EventEmitter;

  constructor() {
    // Инициализация брокера событий
    this.events = new EventEmitter();

    // Инициализация моделей
    this.catalogModel = new CatalogModel(this.events);
    this.cartModel = new CartModel(this.events);
    this.buyerModel = new BuyerModel(this.events);

    // Инициализация API
    const api = new Api(API_URL);
    this.apiService = new ApiService(api);

    // Находим основные элементы DOM
    const headerContainer = ensureElement<HTMLElement>(".header");
    const catalogContainer = ensureElement<HTMLElement>(".gallery");
    const modalContainer = ensureElement<HTMLElement>("#modal-container");

    // Загружаем шаблоны
    this.cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
    this.cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
    this.cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
    this.basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
    this.orderTemplate = ensureElement<HTMLTemplateElement>("#order");
    this.contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
    this.successTemplate = ensureElement<HTMLTemplateElement>("#success");

    // Инициализация основных представлений
    this.headerView = new Header(headerContainer, this.events);
    this.catalogView = new CatalogView(catalogContainer);
    this.modalView = new Modal(modalContainer);

    // Настройка обработчиков событий
    this.setupEventHandlers();

    // Загрузка данных
    this.loadProducts();
  }

  /**
   * Настройка обработчиков событий
   */
  private setupEventHandlers(): void {
    // Обработка события изменения каталога
    this.events.on<CatalogChangedEvent>("catalog:changed", () => {
      this.renderCatalog();
    });

    // Обработка события изменения корзины
    this.events.on<CartChangedEvent>("cart:changed", () => {
      this.updateHeader();
      this.updateCurrentBasketView();
    });

    // Обработка события изменения выбранного товара
    this.events.on<SelectedItemChangedEvent>("selectedItem:changed", () => {
      this.renderProductPreview();
    });

    // Обработка события выбора карточки товара
    this.events.on<CardSelectEvent>("card:select", (data) => {
      this.catalogModel.setSelectedItem(data.product);
    });

    // Обработка события открытия корзины
    this.events.on("basket:open", () => {
      this.openBasket();
    });

    // Обработка события оформления заказа из корзины
    this.events.on("basket:checkout", () => {
      this.openOrderForm();
    });

    // Обработка события отправки формы заказа (первый шаг)
    this.events.on(
      "order:submit",
      (data: { payment: string; address: string }) => {
        this.handleOrderSubmit(data);
      }
    );

    // Обработка события отправки формы контактов (второй шаг)
    this.events.on(
      "contacts:submit",
      (data: { email: string; phone: string }) => {
        this.handleContactsSubmit(data);
      }
    );

    // Обработка события очистки корзины
    this.events.on("basket:clear", () => {
      this.cartModel.clear();
    });

    // Обработка события закрытия успешного оформления
    this.events.on("success:close", () => {
      this.modalView.close();
      this.currentBasketView = null;
    });

    // Обработка события ошибки формы
    this.events.on("form:error", (data: { errors: Record<string, string> }) => {
      console.error("Ошибка формы:", data.errors);
    });

    // Обработка события клика на кнопку в карточке товара
    this.events.on<CardButtonClickEvent>("card:button-click", (data) => {
      const product = this.catalogModel.getItemById(data.productId);
      if (!product) return;

      const isCurrentlyInCart = this.cartModel.contains(product.id);

      if (isCurrentlyInCart) {
        this.cartModel.removeItem(product.id);
      } else {
        this.cartModel.addItem(product);
      }

      // Перерисовываем карточку просмотра
      this.renderProductPreview();
    });

    // Обработка события удаления товара из корзины
    this.events.on<BasketRemoveEvent>("basket:remove", (data) => {
      this.cartModel.removeItem(data.id);
    });
  }

  /**
   * Загрузка товаров с сервера
   */
  private async loadProducts(): Promise<void> {
    try {
      const products = await this.apiService.getProductList();
      this.catalogModel.setItems(products);
      console.log("Товары загружены:", products.length, "шт.");
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  /**
   * Отрисовка каталога товаров
   */
  private renderCatalog(): void {
    const products = this.catalogModel.getItems();
    const cards = products.map((product) => {
      const cardElement = cloneTemplate(this.cardCatalogTemplate);

      const cardView = new CardCatalog(cardElement, {
        onClick: () => {
          this.events.emit<CardSelectEvent>("card:select", { product });
        },
      });

      cardView.render({
        id: product.id,
        title: product.title,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
        price: product.price,
      });

      return cardElement;
    });

    this.catalogView.render({ catalog: cards });
  }

  /**
   * Отрисовка детального просмотра товара
   */
  private renderProductPreview(): void {
    const product = this.catalogModel.getSelectedItem();
    if (!product) return;

    const cardElement = cloneTemplate(this.cardPreviewTemplate);

    const cardView = new CardPreview(cardElement, {
      onButtonClick: (event) => {
        event.preventDefault();
        this.events.emit<CardButtonClickEvent>("card:button-click", {
          productId: product.id,
        });
      },
    });

    const isInCart = this.cartModel.contains(product.id);

    cardView.render({
      id: product.id,
      title: product.title,
      description: product.description,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
      price: product.price,
    });

    if (product.price === null) {
      cardView.buttonText = "Недоступно";
      cardView.buttonDisabled = true;
    } else {
      cardView.buttonText = isInCart ? "Удалить из корзины" : "В корзину";
      cardView.buttonDisabled = false;
    }

    this.modalView.setContent(cardElement);
    this.modalView.open();
  }

  /**
   * Обновление шапки (счетчик корзины)
   */
  private updateHeader(): void {
    const count = this.cartModel.getCount();
    this.headerView.render({ counter: count });
  }

  /**
   * Открытие корзины в модальном окне
   */
  private openBasket(): void {
    const basketContainer = cloneTemplate(this.basketTemplate);
    this.currentBasketView = new BasketView(basketContainer, this.events);

    this.updateCurrentBasketView();

    this.modalView.setContent(basketContainer);
    this.modalView.open();
  }

  /**
   * Обновление текущего BasketView
   */
  private updateCurrentBasketView(): void {
    if (!this.currentBasketView) return;

    const items = this.cartModel.getItems();
    const total = this.cartModel.getTotal();

    const basketCards = items.map((item, index) => {
      const cardElement = cloneTemplate(this.cardBasketTemplate);

      const cardView = new CardBasket(cardElement, {
        onButtonClick: () => {
          this.events.emit<BasketRemoveEvent>("basket:remove", { id: item.id });
        },
      });

      cardView.render({
        id: item.id,
        title: item.title,
        price: item.price,
        index: index + 1,
      });

      return cardElement;
    });

    this.currentBasketView.render({
      items: basketCards,
      total: total,
    });

    this.currentBasketView.toggleCheckoutButton(items.length > 0);
  }

  /**
   * Открытие формы заказа в модальном окне (первый шаг)
   */
  private openOrderForm(): void {
    const data = this.buyerModel.getData();

    const orderContainer = cloneTemplate(this.orderTemplate);
    const orderFormView = new OrderForm(
      orderContainer as HTMLFormElement,
      this.events
    );

    // Устанавливаем сохраненные данные
    if (data.address) {
      orderFormView.address = data.address;
    }

    if (data.payment === "card" || data.payment === "cash") {
      // Сначала устанавливаем значение
      orderFormView.payment = data.payment;

      // Потом программно кликаем на соответствующую кнопку
      // чтобы обновить визуальное состояние и валидацию
      setTimeout(() => {
        const button = orderContainer.querySelector(
          `button[name="${data.payment}"]`
        );
        if (button) {
          (button as HTMLButtonElement).click();
        }
      }, 10);
    }

    this.modalView.setContent(orderContainer);
    this.modalView.open();
  }

  /**
   * Обработка отправки формы заказа (первый шаг)
   */
  private handleOrderSubmit(data: { payment: string; address: string }): void {
    // Сохраняем данные покупателя
    this.buyerModel.setData({
      payment: data.payment as "card" | "cash",
      address: data.address,
    });

    this.openContactsForm();
  }

  /**
   * Открытие формы контактов в модальном окне (второй шаг)
   */
  private openContactsForm(): void {
    const data = this.buyerModel.getData();

    const contactsContainer = cloneTemplate(this.contactsTemplate);
    const contactsFormView = new ContactsForm(
      contactsContainer as HTMLFormElement,
      this.events
    );

    // Устанавливаем сохраненные данные
    if (data.email) {
      contactsFormView.email = data.email;
    }

    if (data.phone) {
      contactsFormView.phone = data.phone;
    }

    this.modalView.setContent(contactsContainer);
  }

  /**
   * Обработка отправки формы контактов (второй шаг)
   */
  private async handleContactsSubmit(data: {
    email: string;
    phone: string;
  }): Promise<void> {
    this.buyerModel.setData({
      email: data.email,
      phone: data.phone,
    });

    const errors = this.buyerModel.validate();
    if (errors) {
      console.error("Ошибки валидации:", errors);
      return;
    }

    await this.createOrder();
  }

  /**
   * Создание и отправка заказа на сервер
   */
  private async createOrder(): Promise<void> {
    try {
      const buyerData = this.buyerModel.getData();
      const cartItems = this.cartModel.getItems();
      const total = this.cartModel.getTotal();

      if (
        !buyerData.payment ||
        !buyerData.email ||
        !buyerData.phone ||
        !buyerData.address
      ) {
        console.error("Не все данные покупателя заполнены");
        return;
      }

      if (cartItems.length === 0) {
        console.error("Корзина пуста");
        return;
      }

      const order = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        items: cartItems.map((item) => item.id),
        total: total,
      };

      console.log("Отправка заказа:", order);

      const response = await this.apiService.createOrder(order);
      console.log("Заказ создан:", response);

      this.showSuccess(response.total);

      this.cartModel.clear();
      this.buyerModel.clear();
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
    }
  }

  /**
   * Показ успешного оформления заказа в модальном окне
   */
  private showSuccess(total: number): void {
    const successContainer = cloneTemplate(this.successTemplate);
    const successView = new SuccessView(successContainer, this.events);

    successView.render({ total });

    this.modalView.setContent(successContainer);
  }
}

// Создаем и запускаем приложение
new AppPresenter();
