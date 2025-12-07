import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from './components/base/Api';
import { ApiService } from './components/Services/ApiService';
import { API_URL } from './utils/constants';

// 1. Проверка работы CatalogModel
console.log("\n1. Проверка работы CatalogModel:");

const catalog = new CatalogModel();
catalog.setItems(apiProducts.items); // Сохраняем тестовые данные
console.log("Сохранённые товары в каталоге:", catalog.getItems());

// Получаем первый товар по ID
if (apiProducts.items.length > 0) {
    const firstProductId = apiProducts.items[0].id;
    const foundProduct = catalog.getItemById(firstProductId);
    console.log(`Товар по ID "${firstProductId}":`, foundProduct);
    
    // Сохраняем и получаем выбранный товар
    if (foundProduct) {
        catalog.setSelectedItem(foundProduct);
        console.log('Выбранный товар для детального просмотра:', catalog.getSelectedItem());
    }
}

// 2. Проверка работы CartModel
console.log("\n2. Проверка работы CartModel:");

const cart = new CartModel();
console.log("Начальное состояние корзины:", cart.getItems());
console.log("Количество товаров в пустой корзине:", cart.getCount());
console.log("Общая стоимость пустой корзины:", cart.getTotal());

// Добавляем товары в корзину
if (apiProducts.items.length > 0) {
  const product1 = apiProducts.items[0];
  const product2 = apiProducts.items[1] || apiProducts.items[0];

  cart.addItem(product1);
  cart.addItem(product2);
  console.log(
    "\nСостояние корзины после добавления двух товаров:",
    cart.getItems()
  );
  console.log("Количество товаров:", cart.getCount());
  console.log("Общая стоимость:", cart.getTotal());

  // Проверяем наличие товара
  console.log(
    `\nТовар с ID "${product1.id}" в корзине:`,
    cart.contains(product1.id)
  );

  // Удаляем товар
  cart.removeItem(product1.id);
  console.log(
    `Состояние корзины после удаления товара "${product1.id}":`,
    cart.getItems()
  );

  // Очищаем корзину
  cart.clear();
  console.log("Состояние корзины после очистки корзины:", cart.getItems());
}

// 3. Проверка работы BuyerModel
console.log("\n3. Проверка работы BuyerModel:");

const buyer = new BuyerModel();
console.log("Начальные данные покупателя:", buyer.getData());

// Сохраняем частичные данные
buyer.setData({ email: "test@example.com", phone: "+71234567890" });
console.log(
  "Данные покупателя после сохранения email и телефона:",
  buyer.getData()
);

// Сохраняем ещё данные
buyer.setData({ address: "Москва, ул. Экзампловская, д. 7" });
console.log("Данные покупателя после добавления адреса:", buyer.getData());

// Валидация (должны быть ошибки, так как нет payment)
console.log("Валидация (без payment):", buyer.validate());

// Добавляем payment и проверяем валидацию
buyer.setData({ payment: "card" });
console.log("Данные покупателя после добавления payment:", buyer.getData());
console.log("Валидация (все поля заполнены):", buyer.validate());

// Очищаем данные
buyer.clear();
console.log("Данные покупателя после очистки данных:", buyer.getData());


// ТЕСТИРОВАНИЕ РАБОТЫ С API
console.log("\nТЕСТИРОВАНИЕ РАБОТЫ С API:");

// Создаем экземпляр Api
const api = new Api(API_URL);

// Создаем экземпляр ApiService
const apiService = new ApiService(api);

// Тестируем получение товаров с сервера
async function testApiService() {
    try {
        // Получаем товары с сервера
        const products = await apiService.getProductList();
        console.log('Товары полученные с сервера:', products);
        
        // Сохраняем товары в CatalogModel
        catalog.setItems(products);
        console.log('Товары сохранены в CatalogModel:', catalog.getItems());
        
        // Проверяем количество товаров
        console.log(`Количество товаров в каталоге: ${catalog.getItems().length}`);
        
        // Выбираем первый товар для детального просмотра
        if (products.length > 0) {
            catalog.setSelectedItem(products[0]);
            console.log('Первый товар выбран для детального просмотра:', catalog.getSelectedItem());
        }
        
        console.log('ApiService.getProductList() работает корректно!');
        
    } catch (error) {
        console.error('Ошибка при тестировании ApiService.getProductList():', error);
    }
}

// Запускаем тестирование API
testApiService();