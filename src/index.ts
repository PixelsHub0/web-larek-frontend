// src/index.ts

import './scss/styles.scss';

import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { LarekAPI } from './components/base/LarekAPI';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Basket } from './components/common/Basket';
import { CatalogView } from './components/views/CatalogView';
import { ProductPreviewView } from './components/views/ProductPreviewView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactFormView } from './components/views/ContactFormView';
import { CatalogPresenter } from './pages/CatalogPresenter';
import { OrderPagePresenter } from './pages/OrderPagePresenter';

import { AppEvent } from './types';
import { API_URL } from './utils/constants';

const emitter = new EventEmitter();
const state = new AppState(emitter);
const api = new LarekAPI(API_URL);

// ─── Обновление заказа ───────────────────────────────
emitter.on(AppEvent.ORDER_UPDATED, (data: Record<string, unknown>) => {
  console.log('🔄 ORDER_UPDATED payload:', data);
  state.updateOrder(data);
});

// ─── DOM элементы ─────────────────────────────────────
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const modalElement = document.querySelector('.modal') as HTMLElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

const headerBasketBtn = document.querySelector('.header__basket') as HTMLElement;

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successElement = successTemplate.content.firstElementChild as HTMLElement;

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderElement = orderTemplate.content.firstElementChild as HTMLFormElement;

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsElement = contactsTemplate.content.firstElementChild as HTMLFormElement;

const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

// ─── UI-компоненты ─────────────────────────────────────
const catalogView = new CatalogView(catalogContainer, emitter);
const modal = new Modal(modalElement);
const success = new Success(successElement);
const basket = new Basket(basketElement);
const orderForm = new OrderFormView(orderElement, emitter);
const contactForm = new ContactFormView(contactsElement, emitter);
const productPreviewView = new ProductPreviewView(previewTemplate, emitter, state);

// ─── Презентеры ────────────────────────────────────────
new CatalogPresenter(emitter, state, catalogView);
new OrderPagePresenter(state, emitter, api, modal, success);

// ─── Загрузка каталога ────────────────────────────────
api.getProducts()
  .then(products => {
    state.setCatalog(products);
    catalogView.render(products);
  })
  .catch(err => console.error('Ошибка загрузки каталога:', err));

// ─── Открытие корзины ─────────────────────────────────
headerBasketBtn.addEventListener('click', () => {
  modal.setContent(basket.getElement());
  modal.open();
});

// ─── Добавление в корзину ─────────────────────────────
emitter.on(AppEvent.ORDER_ADD_PRODUCT, (productId: string) => {
  state.addToBasket(productId);
  renderBasket();
  updateCounter();
});

// ─── Удаление из корзины ─────────────────────────────
emitter.on(AppEvent.ORDER_REMOVE_PRODUCT, (productId: string) => {
  state.removeFromBasket(productId);
  renderBasket();
  updateCounter();
});

// ─── Шаг 1: форма доставки ───────────────────────────
emitter.on(AppEvent.ORDER_DELIVERY_REQUIRED, () => {
  orderForm.reset();
  modal.setContent(orderForm.getElement());
  modal.open();
});

// ─── Шаг 2: форма контактов ──────────────────────────
emitter.on(AppEvent.ORDER_CONTACTS_REQUIRED, () => {
  contactForm.reset();
  modal.setContent(contactForm.getElement());
  modal.open();
});

// ─── Открытие карточки товара ────────────────────────
emitter.on(AppEvent.PRODUCT_PREVIEW_OPEN, (productId: string) => {
  api.getProductById(productId)
    .then(product => {
      modal.setContent(productPreviewView.render(product));
      modal.open();
    })
    .catch(err => {
      console.error('Ошибка при загрузке подробностей товара:', err);
    });
});

// ✅ Очищаем корзину после успешного заказа
emitter.on(AppEvent.ORDER_SUCCESS, () => {
  renderBasket();  // очистка интерфейса
  updateCounter(); // обновление счётчика
});

// ─── Отрисовка корзины ───────────────────────────────
function renderBasket(): void {
  const { basket: ids, catalog } = state.getState();

  const items = ids.map((id, idx) => {
    const product = catalog.find(p => p.id === id);
    const li = document.createElement('li');
    li.className = 'basket__item card card_compact';
    li.innerHTML = `
      <span class="basket__item-index">${idx + 1}</span>
      <span class="card__title">${product?.title ?? 'Неизвестный товар'}</span>
      <span class="card__price">${product?.price ?? 'Бесценно'} синапсов</span>
      <button class="basket__item-delete" aria-label="удалить"></button>
    `;
    li.querySelector('.basket__item-delete')!
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

  const btn = basket.getElement().querySelector('.basket__button') as HTMLButtonElement;
  btn.onclick = () => emitter.emit(AppEvent.ORDER_DELIVERY_REQUIRED);
  btn.disabled = ids.length === 0;
}



// ─── Обновление счётчика ─────────────────────────────
function updateCounter(): void {
  const counter = document.querySelector('.header__basket-counter') as HTMLElement;
  counter.textContent = String(state.getState().basket.length);
}
