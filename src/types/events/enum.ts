// enum.ts
export enum AppEvent {
	CATALOG_CHANGED = 'catalog:changed',
	CART_CHANGED = 'cart:changed',
	ORDER_UPDATED = 'order:updated',
	ORDER_SUBMIT = 'order:submit',
	ORDER_SUCCESS = 'order:success',
	ORDER_ADD_PRODUCT = 'order:add-product',
	ORDER_REMOVE_PRODUCT = 'order:remove-product',
	ORDER_DELIVERY_REQUIRED = 'order:delivery-required',
	ORDER_CONTACTS_REQUIRED = 'order:contacts-required',
}
