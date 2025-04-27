// src/index.ts

import './scss/styles.scss';

import { ensureElement } from './utils/utils';
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
import { CatalogPresenter } from './components/presenter/CatalogPresenter';
import { OrderPagePresenter } from './components/presenter/OrderPagePresenter';

import { AppEvent } from './types';
import { API_URL } from './utils/constants';

// ─── Инициализация core-сущностей ───────────────────────
const emitter = new EventEmitter();
const state   = new AppState(emitter);
const api     = new LarekAPI(API_URL);

// Когда View шлёт ORDER_UPDATED — прокидываем изменения в модель
emitter.on(AppEvent.ORDER_UPDATED, data => {
  state.updateOrder(data);
});

// ─── Получаем корневые элементы через ensureElement ──────
const galleryEl      = ensureElement<HTMLElement>('.gallery');
const modalRootEl    = ensureElement<HTMLElement>('.modal');
const headerBasketEl = ensureElement<HTMLElement>('.header__basket');
const counterEl      = ensureElement<HTMLElement>('.header__basket-counter');

// ─── Создаём view-компоненты ────────────────────────────
const catalogView      = new CatalogView(galleryEl, emitter);

const basketTpl        = ensureElement<HTMLTemplateElement>('#basket');
const basketEl         = basketTpl.content.firstElementChild!
                             .cloneNode(true) as HTMLElement;
const basket           = new Basket(basketEl);
// Подписываемся на клик по кнопке "Оформить"
basket.onCheckout(() => emitter.emit(AppEvent.ORDER_DELIVERY_REQUIRED));

const successTpl       = ensureElement<HTMLTemplateElement>('#success');
const successEl        = successTpl.content.firstElementChild as HTMLElement;
const successView      = new Success(successEl);

const orderTpl         = ensureElement<HTMLTemplateElement>('#order');
const orderFormEl      = orderTpl.content.firstElementChild as HTMLFormElement;
const orderFormView    = new OrderFormView(orderFormEl, emitter);

const contactsTpl      = ensureElement<HTMLTemplateElement>('#contacts');
const contactsFormEl   = contactsTpl.content.firstElementChild as HTMLFormElement;
const contactFormView  = new ContactFormView(contactsFormEl, emitter);

const previewTpl           = ensureElement<HTMLTemplateElement>('#card-preview');
const productPreviewView   = new ProductPreviewView(previewTpl, emitter, state);

const modal              = new Modal(modalRootEl);

// ─── Презентеры ────────────────────────────────────────
new CatalogPresenter(emitter, state, catalogView);
new OrderPagePresenter(state, emitter, api, modal, successView);

// ─── Загрузка каталога ─────────────────────────────────
api.getProducts()
  .then(products => state.setCatalog(products))
  .catch(err => console.error('Ошибка загрузки каталога:', err));

// ─── Открытие корзины ──────────────────────────────────
headerBasketEl.addEventListener('click', () => {
  modal.setContent(basket.getElement());
  modal.open();
});

// ─── Обработка изменения корзины ───────────────────────
emitter.on(AppEvent.CART_CHANGED, () => {
  const { basket: ids, catalog } = state.getState();
  const itemTpl = ensureElement<HTMLTemplateElement>('#card-basket');

  const items = ids.map((id, idx) => {
    const product = catalog.find(p => p.id === id)!;
    const li = itemTpl.content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    ensureElement<HTMLElement>('.basket__item-index', li).textContent = String(idx + 1);
    ensureElement<HTMLElement>('.card__title', li).textContent        = product.title;
    ensureElement<HTMLElement>('.card__price', li).textContent        = `${product.price ?? 'Бесценно'} синапсов`;

    ensureElement<HTMLButtonElement>('.basket__item-delete', li)
      .addEventListener('click', () => {
        emitter.emit(AppEvent.ORDER_REMOVE_PRODUCT, id);
      });

    return li;
  });

  basket.setItems(items);
  const total = ids.reduce((sum, id) => {
    const p = catalog.find(x => x.id === id);
    return sum + (p?.price ?? 0);
  }, 0);
  basket.setTotal(total);
  counterEl.textContent = String(ids.length);
});

// ─── Добавление/удаление товара ────────────────────────
emitter.on(AppEvent.ORDER_ADD_PRODUCT,    (id: string) => state.addToBasket(id));
emitter.on(AppEvent.ORDER_REMOVE_PRODUCT, (id: string) => state.removeFromBasket(id));

// ─── Шаг 1: форма доставки ────────────────────────────
emitter.on(AppEvent.ORDER_DELIVERY_REQUIRED, () => {
  orderFormView.reset();
  modal.setContent(orderFormView.getElement());
  modal.open();
});

// ─── Шаг 2: форма контактов ───────────────────────────
emitter.on(AppEvent.ORDER_CONTACTS_REQUIRED, () => {
  contactFormView.reset();
  modal.setContent(contactFormView.getElement());
  modal.open();
});

// ─── Предпросмотр товара без запроса к серверу ────────
emitter.on(AppEvent.PRODUCT_PREVIEW_OPEN, (productId: string) => {
  const product = state.getState().catalog.find(p => p.id === productId);
  if (!product) {
    console.error(`Product with id=${productId} not found in state`);
    return;
  }
  modal.setContent(productPreviewView.render(product));
  modal.open();
});
