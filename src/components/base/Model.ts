import { EventEmitter } from './EventEmitter';
/*
Model отвечает за :
 - хранение состояния (например, корзина, список товаров, форма заказа)

 - безопасное обновление этого состояния

 - уведомление других компонентов о том, что данные изменились (через EventEmitter)
*/
export abstract class Model<T> {
	protected state: T; // Здесь хранится всё состояние, с которым работает модель.
	/*
	events — брокер событий (тот самый EventEmitter)
	initialState — начальное состояние модели (например, пустая корзина или массив товаров)
	*/
	constructor(protected events: EventEmitter, initialState: T) {
		this.state = initialState;
	}
	/*
	getState(): T :
	Возвращает текущее состояние модели — используется презентером или в других частях системы.
	*/
	public getState(): T {
		return this.state;
	}
	/*
	setState(newState: Partial<T>):
	- Обновляет состояние частично:

 	- Использует ...spread для сохранения предыдущего состояния

 	- Вызывает this.emitState() — сообщает, что состояние изменилось
	*/
	public setState(newState: Partial<T>): void {
		this.state = { ...this.state, ...newState };
		this.emitState();
	}
/*
protected abstract emitState(): void :
	Абстрактный метод, который должен быть реализован в подклассах (наследниках).
	Он должен вызвать this.events.emit(...) с нужным событием, чтобы известить других о смене состояния.
*/
	protected abstract emitState(): void;
}

