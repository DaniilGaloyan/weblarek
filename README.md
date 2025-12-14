# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с компонентами приложения
- src/components/base/ — папка с базовым кодом
- src/components/Models/ — папка с моделями данных (слой Model)
- src/components/Services/ — папка с сервисами приложения
- src/components/View/ — папка с представлениями (слой View)
- src/types/ — папка с типами TypeScript
- src/utils/ — папка с утилитами и константами
- src/pages/ — папка с HTML страницами
- src/scss/ — папка со стилями проекта

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные
В приложении используются следующие типы данных:

### Интерфейс IProduct
Описывает товар в каталоге магазина.

**Поля:**
- `id: string` - уникальный идентификатор товара;
- `title: string` - название товара;
- `description: string` - описание товара;
- `image: string` - URL изображения товара;
- `category: string` - категория товара;
- `price: number | null` - цена товара (может отсутствовать).

### Интерфейс IBuyer
Описывает данные покупателя при оформлении заказа.

**Поля:**
- `payment: TPayment;` - способ оплаты (`'card'` или `'cash'`);
- `email: string;` - электронная почта покупателя;
- `phone: string;` - номер телефона покупателя;
- `address: string;` - адрес доставки.

### Тип TPayment
Определяет возможные способы оплаты в приложении:
- `'card'` — оплата банковской картой;
- `'cash'` — оплата наличными при получении.
  
### Тип TOrder
Описывает полные данные заказа при оформлении для отправки на сервер через API. Объединяет информацию о товарах и данные покупателя.

**Структура:**
- `items: string[]` — массив идентификаторов товаров, выбранных для покупки;
- `total: number` — общая стоимость заказа;
- Все поля из `IBuyer`:
  - `payment: TPayment` — способ оплаты;
  - `email: string` — электронная почта;
  - `phone: string` — номер телефона;
  - `address: string` — адрес доставки.


## Модели данных
Модели данных отвечают за хранение и управление данными приложения. Они не зависят от представления и других слоёв приложения.

### Класс CatalogModel
Отвечает за хранение каталога товаров и управление им.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**
- `private _items: IProduct[]` — массив всех товаров каталога;
- `private _selectedItem: IProduct | null` — товар, выбранный для детального просмотра;
- `private events: IEvents` — брокер событий.

**Методы:**
- `setItems(items: IProduct[]): void` — сохраняет массив товаров в каталог и генерирует событие `catalog:changed`;
- `getItems(): IProduct[]` — возвращает все товары каталога;
- `getItemById(id: string): IProduct | undefined` — возвращает товар по его ID;
- `setSelectedItem(item: IProduct): void` — сохраняет товар для детального просмотра и генерирует событие `selectedItem:changed`;
- `getSelectedItem(): IProduct | null` — возвращает выбранный товар.

### Класс CartModel
Отвечает за хранение товаров в корзине покупок и управление ими.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**
- `private _items: IProduct[]` — массив товаров в корзине;
- `private events: IEvents` — брокер событий.

**Методы:**
- `getItems(): IProduct[]` — возвращает все товары в корзине;
- `addItem(item: IProduct): void` — добавляет товар в корзину и генерирует событие `cart:changed`;
- `removeItem(id: string): void` — удаляет товар из корзины по ID и генерирует событие `cart:changed`;
- `clear(): void` — полностью очищает корзину и генерирует событие `cart:changed`;
- `getTotal(): number` — возвращает общую стоимость товаров в корзине;
- `getCount(): number` — возвращает количество товаров в корзине;
- `contains(id: string): boolean` — проверяет, есть ли товар с указанным ID в корзине.

### Класс BuyerModel
Отвечает за хранение и валидацию данных покупателя при оформлении заказа.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**
- `private _data: Partial<IBuyer>` — объект с данными покупателя (может быть частично заполнен);
- `private events: IEvents` — брокер событий.

**Методы:**
- `setData(data: Partial<IBuyer>): void` — сохраняет данные покупателя и генерирует событие `buyer:changed`;
- `getData(): Partial<IBuyer>` — возвращает все сохранённые данные покупателя;
- `clear(): void` — очищает все данные покупателя и генерирует событие `buyer:changed`;
- `validate(): Record<keyof IBuyer, string> | null` — проверяет валидность данных. Возвращает объект с ошибками для невалидных полей или `null`, если все данные корректны.

## Слой коммуникации
Класс ApiService отвечает за взаимодействие с сервером через API. Использует композицию с классом Api для выполнения HTTP-запросов.

### Класс ApiService
Отвечает за получение данных с сервера и отправку данных на сервер.

**Конструктор:**
`constructor(api: IApi)` — принимает экземпляр класса, реализующего интерфейс IApi.

**Поля:**
- `private _api: IApi` — экземпляр API-клиента для выполнения запросов.

**Методы:**
- `getProductList(): Promise<IProduct[]>` — выполняет GET-запрос для получения каталога товаров с сервера;
- `createOrder(order: TOrder): Promise<object>` — выполняет POST-запрос для отправки данных заказа на сервер.


## Слой Представления (View)
Слой Представления (View) отвечает за отображение интерфейса, взаимодействие с пользователем (генерирует события при действиях пользователя). Компоненты слоя перерисовываются только при получении данных от презентера.

### Класс Header
Класс представления шапки сайта с логотипом и иконкой корзины.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)`:
  - `container: HTMLElement` - корневой DOM-элемент шапки;
  - `events: IEvents` - брокер событий.

**Поля:**
- `protected _counterElement: HTMLElement` — элемент счетчика товаров в корзине;
- `protected _basketButton: HTMLButtonElement` — кнопка корзины.

**Методы:**
- `set counter(value: number): void` — устанавливает значение счетчика товаров в корзине.

**Генерируемые события:**
- `basket:open` — при клике на кнопку корзины.

### Интерфейс IHeader
Описывает данные для отображения шапки сайта.

**Поля:**
- `counter: number` - количество товаров в корзине для отображения в счетчике.

### Класс CatalogView
Класс представления каталога товаров на главной странице.

**Конструктор:**
- `constructor(container: HTMLElement)`:
  - `container: HTMLElement` - корневой DOM-элемент каталога.

**Поля:**
- `protected _cards: HTMLElement[]` — массив карточек товаров в каталоге.

**Методы:**
- `setItems(items: HTMLElement[]): void` — устанавливает карточки товаров в каталог;
- `addCard(card: HTMLElement): void` — добавляет карточку товара в каталог;
- `clear(): void` — очищает каталог (удаляет все карточки).

### Интерфейс ICatalogView
Описывает данные для отображения каталога товаров.

**Поля:**
- `catalog: HTMLElement[]` - массив DOM-элементов карточек товаров для отображения в каталоге.

### Класс Card
Абстрактный класс для всех типов карточек товара.

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)`:
- `container: HTMLElement` — корневой DOM-элемент карточки;
- `actions?: ICardActions` — опциональные обработчики событий.

**Поля:**
- `protected _category?: HTMLElement` — элемент категории товара;
- `protected _title?: HTMLElement` — элемент названия товара;
- `protected _image?: HTMLImageElement` — элемент изображения товара;
- `protected _price?: HTMLElement` — элемент цены товара;
- `protected _button?: HTMLButtonElement` — кнопка действия.

**Методы:**
- `set category(value: string): void` — устанавливает категорию товара;
- `set title(value: string): void` — устанавливает название товара;
- `set image(value: string): void` — устанавливает изображение товара;
- `set price(value: number | null): void` — устанавливает цену товара;
- `set buttonText(value: string): void` — устанавливает текст кнопки;
- `set buttonDisabled(value: boolean): void` — устанавливает состояние кнопки (активна/неактивна).

### Интерфейс ICardActions
Определяет структуру обработчиков событий для карточек товара.

**Поля:**
- `onClick?: (event: MouseEvent) => void` — опциональный обработчик клика по всей карточке;
- `onButtonClick?: (event: MouseEvent) => void` — опциональный обработчик клика по кнопке.

### Класс CardCatalog
Класс для отображения карточки товара в каталоге на главной странице, который наследуется от `Card<TCardCatalog>`.

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)`:
- `container: HTMLElement` — корневой DOM-элемент карточки;
- `actions?: ICardActions` — опциональные обработчики событий.

**Методы:**
- `set category(value: string): void` — устанавливает категорию товара с применением соответствующего CSS-класса;
- `set image(value: string): void` — устанавливает изображение товара.

**Генерируемые события:**
- `card:select` — при клике на карточку товара. Генерирует событие типа `CardSelectEvent`, содержащее объект товара `product: IProduct`.

### Тип TCardCatalog
Определяет структуру данных, необходимых для отображения карточки товара в каталоге.

**Поля:**
- `id: string` — уникальный идентификатор товара;
- `title: string` — название товара;
- `image: string` — URL изображения товара;
- `category: string` — категория товара;
- `price: number | null` — цена товара (может отсутствовать).

### Класс CardPreview
Класс карточки товара для детального просмотра в модальном окне, который наследуется от `Card<TCardPreview>`.

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)`:
- `container: HTMLElement` — корневой DOM-элемент карточки;
- `actions?: ICardActions` — опциональные обработчики событий.

**Поля:**
- `protected _description: HTMLElement` — элемент описания товара;
- `protected _category: HTMLElement` — элемент категории товара;
- `protected _image: HTMLImageElement` — элемент изображения товара;
- `protected _button: HTMLButtonElement` — кнопка действия.

**Методы:**
- `set description(value: string): void` — устанавливает описание товара;
- `set category(value: string): void` — устанавливает категорию товара с применением соответствующего CSS-класса;
- `set image(value: string): void` — устанавливает изображение товара.

**Генерируемые события:**
- `card:button-click` — при клике на кнопку карточки товара. Генерирует событие типа `CardButtonClickEvent`, содержащее идентификатор товара `productId: string`.

### Тип TCardPreview
Определяет структуру данных, необходимых для отображения карточки товара в каталоге.

**Поля:**
- `id: string` — уникальный идентификатор товара;
- `title: string` — название товара;
- `description: string` — описание товара;
- `image: string` — URL изображения товара;
- `category: string` — категория товара;
- `price: number | null` — цена товара (может отсутствовать).

### Класс CardBasket
Класс карточки товара для отображения в корзине, который наследуется от `Card<TCardBasket>`.

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)`:
- `container: HTMLElement` — корневой DOM-элемент карточки;
- `actions?: ICardActions` — опциональные обработчики событий.

**Поля:**
- `protected _index: HTMLElement` — элемент порядкового номера товара;
- `protected _button: HTMLButtonElement` — кнопка удаления товара.

**Методы:**
- `set index(value: number): void` — устанавливает порядковый номер товара.

**Генерируемые события:**
- `basket:remove` — при клике на кнопку удаления товара из корзины. Генерирует событие типа `BasketRemoveEvent`, содержащее идентификатор товара `id: string`.

### Тип TCardBasket
Определяет структуру данных, необходимых для отображения карточки товара в корзине.

**Поля:**
- `index: number` — порядковый номер товара в корзине;
- `id: string` — уникальный идентификатор товара;
- `title: string` — название товара;
- `price: number | null` — цена товара (может отсутствовать).

### Класс BasketView
Класс представления корзины товаров.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)`:
- `container: HTMLElement` — корневой DOM-элемент корзины;
- `events: IEvents` — брокер событий для генерации событий.

**Поля:**
- `protected _list: HTMLElement` — список товаров в корзине;
- `protected _total: HTMLElement` — элемент общей стоимости товаров;
- `protected _checkoutButton: HTMLButtonElement` — кнопка "Оформить";
- `protected _emptyMessage: HTMLElement | null` — сообщение "Корзина пуста".

**Методы:**
- `setItems(items: HTMLElement[]): void` — устанавливает список товаров в корзине;
- `setTotal(total: number): void` — устанавливает общую стоимость товаров;
- `toggleCheckoutButton(enable: boolean): void` — активирует/деактивирует кнопку "Оформить";
- `clear(): void` — очищает корзину.

**Генерируемые события:**
- `basket:checkout` — при клике на кнопку "Оформить";
- `basket:clear` — при очистке корзины.

### Интерфейс IBasketView
Описывает данные для отображения корзины товаров.

**Поля:**
- `total: number` — общая стоимость товаров в корзине;
- `items: HTMLElement[]` — список DOM-элементов товаров для отображения в корзине.

### Класс Modal
Класс для отображения модального окна.

**Конструктор:**
`constructor(container: HTMLElement)`:
- `container: HTMLElement` — корневой DOM-элемент модального окна.

**Поля:**
- `protected _content: HTMLElement` — контейнер для контента модального окна;
- `protected _closeButton: HTMLButtonElement` — кнопка закрытия модального окна.

**Методы:**
- `open(): void` — открывает модальное окно (добавляет класс `modal_active`);
- `close(): void` — закрывает модальное окно (удаляет класс `modal_active`);
- `setContent(content: HTMLElement): void` — устанавливает содержимое модального окна.

### Класс Form
Абстрактный класс для всех форм.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IFormEvents)`:
- `container: HTMLFormElement` — корневой DOM-элемент формы;
- `events: IFormEvents` — абстрактный интерфейс для генерации событий.

**Поля:**
- `protected _submitButton: HTMLButtonElement` — кнопка отправки формы;
- `protected _errorContainer: HTMLElement` — контейнер для отображения ошибок;
- `protected _inputs: Map<string, HTMLInputElement>` — коллекция полей ввода формы.

**Методы:**
- `protected toggleSubmitButton(enable: boolean): void` — активирует/деактивирует кнопку отправки;
- `protected setErrors(errors: Record<string, string>): void` — отображает ошибки валидации;
- `protected clearErrors(): void` — очищает отображение ошибок;
- `protected abstract validate(): boolean` — проверяет валидность данных формы;
- `protected abstract setupValidation(): void` — настройка валидации для конкретного типа формы;
- `protected abstract onSubmit(): void` — обработка отправки формы.

### Интерфейс IFormEvents
Абстрактный интерфейс для событий форм, обеспечивающий соблюдение инверсии зависимостей.

**Методы:**
- `emit<T extends object>(event: string, data?: T): void` — генерирует событие с данными.

### Класс OrderForm
Класс формы первого шага оформления заказа (выбор оплаты и адреса), который наследуется от `Form<IOrderForm>`.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IFormEvents)`:
- `container: HTMLFormElement` — корневой DOM-элемент формы;
- `events: IFormEvents` — абстрактный интерфейс для генерации событий.

**Поля:**
- `protected _paymentButtons: NodeListOf<HTMLButtonElement>` — кнопки выбора способа оплаты;
- `protected _addressInput: HTMLInputElement` — поле ввода адреса доставки;
- `protected _selectedPayment: string` — текущий выбранный способ оплаты.

**Методы:**
- `protected validate(): boolean` — проверяет валидность данных формы (выбрана кнопка оплаты и заполнено поле адреса доставки);
- `protected setupValidation(): void` — настраивает валидацию для полей формы;
- `protected onSubmit(): void` — обрабатывает отправку формы;
- `setPayment(payment: string): void` — устанавливает способ оплаты (добавляет класс `button_alt-active` выбранной кнопке);
- `set address(address: string): void` — устанавливает адрес доставки.

**Генерируемые события:**
- `order:submit` — при успешной отправке формы (передает данные `{ payment, address }`);
- `payment:selected` — при выборе способа оплаты (передает данные `{ payment }`);
- `form:error` — при ошибках валидации формы (передает данные `{ errors }`).

### Интерфейс IOrderForm
Определяет структуру данных, необходимых для отображения формы первого шага оформления заказа.

**Поля:**
- `payment: string` — способ оплаты (`'card'` или `'cash'`);
- `address: string` — адрес доставки.

### Класс ContactsForm
Класс формы второго шага оформления заказа (ввод контактных данных), который наследуется от `Form<IContactsForm>`.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IFormEvents)`:
- `container: HTMLFormElement` — корневой DOM-элемент формы;
- `events: IFormEvents` — абстрактный интерфейс для генерации событий.

**Поля:**
- `protected _emailInput: HTMLInputElement` — поле ввода email;
- `protected _phoneInput: HTMLInputElement` — поле ввода телефона.

**Методы:**
- `protected validate(): boolean` — проверяет валидность данных формы (email и телефон);
- `protected setupValidation(): void` — настраивает валидацию для полей формы;
- `protected onSubmit(): void` — обрабатывает отправку формы;
- `set email(value: string): void` — устанавливает значение email;
- `set phone(value: string): void` — устанавливает значение телефона;
- `protected isValidEmail(email: string): boolean` — метод проверки формата email;
- `protected isValidPhone(phone: string): boolean` — метод проверки формата телефона.

**Генерируемые события:**
- `contacts:submit` — при успешной отправке формы (передает данные `{ email, phone }`);
- `form:error` — при ошибках валидации формы (передает данные `{ errors }`).

### Интерфейс IContactsForm
Определяет структуру данных, необходимых для отображения формы второго шага оформления заказа.

**Поля:**
- `email: string` — адрес электронной почты;
- `phone: string` — номер телефона.

### Класс SuccessView
Класс представления сообщения об успешном оформлении заказа.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)`:
- `container: HTMLElement` — корневой DOM-элемент сообщения;
- `events: IEvents` — брокер событий для генерации событий.

**Поля:**
- `protected _title: HTMLElement` — заголовок сообщения;
- `protected _description: HTMLElement` — элемент описания с суммой заказа;
- `protected _closeButton: HTMLButtonElement` — кнопка закрытия.

**Методы:**
- `setTotal(total: number): void` — устанавливает сумму заказа в описании.

**Генерируемые события:**
- `success:close` — при клике на кнопку закрытия сообщения.

### Интерфейс ISuccessView
Описывает данные для отображения сообщения об успешном оформлении заказа.

**Поля:**
- `total: number` — общая сумма заказа.


## Слой Презентера (Presenter)
Слой Презентера (Presenter) отвечает за бизнес-логику и взаимодействие между слоями модели (Model) и представления (View). Презентер подписывается на события, обрабатывает их и обновляет соответствующие компоненты.
Реализация презентера находится в `src/main.ts` в классе `AppPresenter`.

### Класс AppPresenter
Главный класс слоя презентера, реализующий бизнес-логику и связывающий Model и View слои.

**Принцип работы:**
1. При инициализации загружает товары с сервера через `ApiService.getProductList()`;
2. Подписывается на события от Model и View в методе `setupEventHandlers()`;
3. При событиях от View (действия пользователя) обновляет соответствующие Model;
4. При событиях от Model (изменение данных) обновляет соответствующие View;
5. Координирует всю бизнес-логическу приложения:
   - Просмотр каталога → выбор товара → детальный просмотр;
   - Добавление/удаление товаров в корзине → обновление счетчика;
   - Открытие корзины → оформление заказа → ввод данных → отправка на сервер;
   - Отображение результата и очистка состояния.

**Конструктор:**
`constructor()` — не принимает параметров, инициализирует все компоненты приложения, настраивает обработчики событий и загружает данные с сервера.

**Поля:**
- `private catalogModel: CatalogModel` — модель каталога товаров;
- `private cartModel: CartModel` — модель корзины покупок;
- `private buyerModel: BuyerModel` — модель данных покупателя;
- `private headerView: Header` — представление шапки сайта;
- `private catalogView: CatalogView` — представление каталога товаров;
- `private modalView: Modal` — представление модального окна;
- `private apiService: ApiService` — сервис для работы с API;
- `private events: EventEmitter` — брокер событий;
- `private currentBasketView: BasketView | null` — текущее открытое представление корзины.

**Основные методы:**
- `private setupEventHandlers(): void` — настраивает обработчики для всех событий в системе;
- `private loadProducts(): Promise<void>` — загружает товары с сервера через `ApiService`;
- `private renderCatalog(): void` — отрисовывает каталог товаров на основе данных из `CatalogModel`;
- `private renderProductPreview(): void` — отрисовывает детальный просмотр выбранного товара;
- `private updateHeader(): void` — обновляет счетчик товаров в корзине в шапке сайта;
- `private openBasket(): void` — открывает корзину товаров в модальном окне;
- `private openOrderForm(): void` — открывает форму оформления заказа (первый шаг);
- `private openContactsForm(): void` — открывает форму ввода контактных данных (второй шаг);
- `private handleOrderSubmit(data: { payment: string, address: string }): void` — обрабатывает отправку формы заказа;
- `private handleContactsSubmit(data: { email: string, phone: string }): Promise<void>` — обрабатывает отправку формы контактов;
- `private createOrder(): Promise<void>` — создает и отправляет заказ на сервер через `ApiService`;
- `private showSuccess(total: number): void` — показывает сообщение об успешном оформлении заказа.


## Система событий
Система событий реализует взаимодействие между слоями Model, View и Presenter через брокер событий `EventEmitter`.

### Принцип работы событий:
1. View-компоненты генерируют события при действиях пользователя (клики, отправка форм);
2. Презентер (`AppPresenter`) подписывается на эти события в методе `setupEventHandlers()`;
3. Презентер обрабатывает события, выполняя бизнес-логику и обновляя Model;
4. Model-компоненты генерируют события при изменении своих данных;
5. Презентер подписывается на события Model и обновляет соответствующие View.

### События, генерируемые Model:
- `catalog:changed` — генерируется `CatalogModel` при изменении списка товаров в каталоге. Содержит данные: `{ items: IProduct[] }`;
- `selectedItem:changed` — генерируется `CatalogModel` при изменении выбранного товара. Содержит данные: `{ selectedItem: IProduct | null }`;
- `cart:changed` — генерируется `CartModel` при изменении содержимого корзины. Содержит данные: `{ items: IProduct[] }`;
- `buyer:changed` — генерируется `BuyerModel` при изменении данных покупателя. Содержит данные: `{ data: Partial<IBuyer> }`.

### События, генерируемые View:
- `card:select` — генерируется `CardCatalog` при клике на карточку товара в каталоге. Содержит данные: `{ product: IProduct }`;
- `card:button-click` — генерируется `CardPreview` при клике на кнопку в карточке просмотра товара. Содержит данные: `{ productId: string }`;
- `basket:open` — генерируется `Header` при клике на иконку корзины. Событие без данных;
- `basket:checkout` — генерируется `BasketView` при клике на кнопку "Оформить". Событие без данных;
- `basket:remove` — генерируется `CardBasket` при удалении товара из корзины. Содержит данные: `{ id: string }`;
- `basket:clear` — генерируется `BasketView` при очистке корзины. Событие без данных;
- `order:submit` — генерируется `OrderForm` при отправке формы заказа. Содержит данные: `{ payment: string, address: string }`;
- `payment:selected` — генерируется `OrderForm` при выборе способа оплаты. Содержит данные: `{ payment: string }`;
- `contacts:submit` — генерируется `ContactsForm` при отправке формы контактов. Содержит данные: `{ email: string, phone: string }`;
- `form:error` — генерируется `OrderForm` и `ContactsForm` при ошибках валидации формы. Содержит данные: `{ errors: Record<string, string> }`;
- `success:close` — генерируется `SuccessView` при закрытии окна успешного оформления. Событие без данных.
