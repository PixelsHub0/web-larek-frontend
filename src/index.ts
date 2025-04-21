import './scss/styles.scss';

import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { LarekAPI } from './components/base/LarekAPI';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Basket } from './components/common/Basket';
import { CatalogView } from './components/views/CatalogView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactFormView } from './components/views/ContactFormView';
import { CatalogPresenter } from './pages/CatalogPresenter';
import { OrderPagePresenter } from './pages/OrderPagePresenter';

import { AppEvent } from './types';
import { API_URL } from './utils/constants';

// --- Инициализация основных компонентов ---
const emitter = new EventEmitter();
const state = new AppState(emitter);
const api = new LarekAPI(API_URL);

// --- DOM-элементы ---
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

// --- UI-компоненты ---
const catalogView = new CatalogView(catalogContainer, emitter);
const modal = new Modal(modalElement);
const success = new Success(successElement);
const basket = new Basket(basketElement);
const orderForm = new OrderFormView(orderElement, emitter);
const contactForm = new ContactFormView(contactsElement, emitter);

// --- Презентеры ---
new CatalogPresenter(emitter, state, catalogView);
new OrderPagePresenter(state, emitter, api, modal, success);

// --- Получение каталога товаров ---
api.getProducts().then(products => {
	state.setCatalog(products);
});

// --- Показ корзины ---
headerBasketBtn.addEventListener('click', () => {
	modal.setContent(basket.getElement());
	modal.open();
});

// --- Обработка добавления товара ---
emitter.on(AppEvent.ORDER_ADD_PRODUCT, (productId: string) => {
	state.addToBasket(productId);
	renderBasket();
	updateCounter();
});

// --- Обработка удаления товара ---
emitter.on(AppEvent.ORDER_REMOVE_PRODUCT, (productId: string) => {
	state.removeFromBasket(productId);
	renderBasket();
	updateCounter();
});

// --- Переход к форме оформления (шаг 1) ---
emitter.on(AppEvent.ORDER_DELIVERY_REQUIRED, () => {
	orderForm.reset();
	modal.setContent(orderForm.getElement());
	modal.open();
});

// --- Переход ко второму шагу — контакты ---
emitter.on(AppEvent.ORDER_CONTACTS_REQUIRED, () => {
	contactForm.reset();
	modal.setContent(contactForm.getElement());
	modal.open();
});

// --- Рендер корзины ---
function renderBasket(): void {
	const { basket: basketIds, catalog } = state.getState();

	const basketItems = basketIds.map((id, index) => {
		const product = catalog.find(p => p.id === id);
		const item = document.createElement('li');
		item.classList.add('basket__item');

		item.innerHTML = `
			<span class="basket__item-index">${index + 1}</span>
			<span class="card__title">${product?.title ?? 'Неизвестный товар'}</span>
			<span class="card__price">${product?.price ?? 'Бесценно'}</span>
			<button class="basket__item-delete" aria-label="удалить"></button>
		`;

		item.querySelector('.basket__item-delete')?.addEventListener('click', () => {
			emitter.emit(AppEvent.ORDER_REMOVE_PRODUCT, id);
		});

		return item;
	});

	basket.setItems(basketItems);

	// Итоговая сумма
	const total = basketIds.reduce((sum, id) => {
		const product = catalog.find(p => p.id === id);
		return sum + (product?.price ?? 0);
	}, 0);

	basket.setTotal(total);

	// Кнопка "Оформить"
	const submitBtn = basket.getElement().querySelector('.basket__button') as HTMLButtonElement;
	submitBtn.onclick = () => {
		emitter.emit(AppEvent.ORDER_DELIVERY_REQUIRED);
	};
}

// --- Обновление счётчика в шапке ---
function updateCounter(): void {
	const counter = document.querySelector('.header__basket-counter') as HTMLElement;
	counter.textContent = String(state.getState().basket.length);
}
