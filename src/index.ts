// src/index.ts

import './scss/styles.scss';

import { ensureElement, cloneTemplate } from './utils/utils';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { LarekAPI } from './components/services/LarekAPI';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Basket } from './components/common/Basket';
import { CatalogView } from './components/views/CatalogView';
import { ProductPreviewView } from './components/views/ProductPreviewView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactFormView } from './components/views/ContactFormView';
import { BasketItemView } from './components/views/BasketItemView';
import { HeaderView } from './components/views/HeaderView';
import { CatalogPresenter } from './components/presenter/CatalogPresenter';
import { OrderPagePresenter } from './components/presenter/OrderPagePresenter';

import { AppEvent } from './types';
import { API_URL } from './utils/constants';

// ─── Core ───────────────────────────────────────────────
const eventEmitter = new EventEmitter();
const appState     = new AppState(eventEmitter);
const apiClient    = new LarekAPI(API_URL);

// Слушаем обновления полей заказа из View
eventEmitter.on(AppEvent.ORDER_UPDATED, orderData => {
  appState.updateOrder(orderData);
});

// ─── DOM Roots ─────────────────────────────────────────
const galleryElement    = ensureElement<HTMLElement>('.gallery');
const headerRoot        = ensureElement<HTMLElement>('header');
const modalRootElement  = ensureElement<HTMLElement>('.modal');

// ─── Views ─────────────────────────────────────────────
const headerView         = new HeaderView(headerRoot);
const catalogView        = new CatalogView(galleryElement, eventEmitter);

const basketView         = new Basket(cloneTemplate<HTMLElement>('#basket'));
basketView.onCheckout(() => eventEmitter.emit(AppEvent.ORDER_DELIVERY_REQUIRED));

const successView        = new Success(cloneTemplate<HTMLElement>('#success'));

const orderFormView      = new OrderFormView(
  cloneTemplate<HTMLFormElement>('#order'),
  eventEmitter
);

const contactFormView    = new ContactFormView(
  cloneTemplate<HTMLFormElement>('#contacts'),
  eventEmitter
);

const previewTemplate    = ensureElement<HTMLTemplateElement>('#card-preview');
const productPreviewView = new ProductPreviewView(previewTemplate, eventEmitter, appState);

// Единожды находим шаблон строки корзины
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модальное окно
const modal = new Modal(modalRootElement);

// ─── Presenters ────────────────────────────────────────
new CatalogPresenter(eventEmitter, appState, catalogView);
new OrderPagePresenter(appState, eventEmitter, apiClient, modal, successView);

// ─── Загрузка каталога ─────────────────────────────────
apiClient.getProducts()
  .then(products => appState.setCatalog(products))
  .catch(err => console.error('Ошибка загрузки каталога:', err));

// ─── Открытие корзины через HeaderView ─────────────────
headerView.onBasketClick(() => {
  modal.setContent(basketView.getElement());
  modal.open();
});

// ─── Обновление списка в корзине ───────────────────────
eventEmitter.on(AppEvent.CART_CHANGED, () => {
  const { basket: productIds, catalog } = appState.getState();

  const itemElements = productIds.map((productId, index) => {
    const product = catalog.find(p => p.id === productId)!;
    const clonedEl = basketItemTemplate.content
      .firstElementChild!
      .cloneNode(true) as HTMLElement;
    const itemView = new BasketItemView(clonedEl, eventEmitter, product, index);
    return itemView.getElement();
  });

  basketView.setItems(itemElements);

  const total = productIds.reduce((sum, pid) => {
    const prod = catalog.find(p => p.id === pid)!;
    return sum + (prod.price ?? 0);
  }, 0);
  basketView.setTotal(total);

  headerView.setCounter(productIds.length);
});

// ─── Добавление/удаление товаров ───────────────────────
eventEmitter.on(AppEvent.ORDER_ADD_PRODUCT,    pid => appState.addToBasket(pid));
eventEmitter.on(AppEvent.ORDER_REMOVE_PRODUCT, pid => appState.removeFromBasket(pid));

// ─── Шаг 1: форма доставки ─────────────────────────────
eventEmitter.on(AppEvent.ORDER_DELIVERY_REQUIRED, () => {
  orderFormView.reset();
  modal.setContent(orderFormView.getElement());
  modal.open();
});

// ─── Шаг 2: форма контактов ────────────────────────────
eventEmitter.on(AppEvent.ORDER_CONTACTS_REQUIRED, () => {
  contactFormView.reset();
  modal.setContent(contactFormView.getElement());
  modal.open();
});

// ─── Предпросмотр товара ──────────────────────────────
eventEmitter.on(AppEvent.PRODUCT_PREVIEW_OPEN, pid => {
  const product = appState.getState().catalog.find(p => p.id === pid);
  if (!product) {
    console.error(`Product with id=${pid} not found`);
    return;
  }
  modal.setContent(productPreviewView.render(product));
  modal.open();
});
