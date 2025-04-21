// Это тип для коллбеков, которые можно подписывать на события.
type EventHandler = (...args: any[]) => void; //(...args: any[]) — означает, что функция может принимать любые аргументы.

/*
 Назначение EventEmitter
Класс EventEmitter — это брокер событий, или шина коммуникации между частями приложения.

 Он позволяет:

 - подписаться на событие → on(...)

 = отписаться от события → off(...)

 - вызвать (выпустить) событие → emit(...)

 Это основа для связи между Model ↔ Presenter ↔ View без жёстких зависимостей.
*/

export class EventEmitter {
	private events: Record<string, EventHandler[]> = {}; //Это таблица всех событий и их слушателей.
/*
ON : Подписывает функцию на событие.

 Если слушателей ещё нет, создаёт массив.
Добавляет handler в массив событий.
*/
	public on(event: string, handler: EventHandler): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(handler);
	}
/*
OFF - Удаляет конкретный обработчик из массива слушателей.

Это нужно, чтобы:

 - избежать дублирующихся подписок

 - убрать подписку при destroy()
*/
	public off(event: string, handler: EventHandler): void {
		if (!this.events[event]) return;
		this.events[event] = this.events[event].filter(h => h !== handler);
	}
/*
emit Вызывает всех слушателей события и передаёт им аргументы.

это и есть момент, когда:

 - View отправляет сигнал о действии

 - Model сообщает о новых данных

 - Presenter реагирует


*/
	public emit(event: string, ...args: any[]): void {
		if (!this.events[event]) return;
		this.events[event].forEach(handler => handler(...args));
	}

		public once<T = unknown>(event: string, listener: (data: T) => void): void {
		const onceWrapper = (data: T) => {
			this.off(event, onceWrapper);
			listener(data);
		};
		this.on(event, onceWrapper);
	}
}

/*
✅ Вывод по EventEmitter.ts

Элемент	Назначение
on(...)	Подписка на событие
off(...)	Отписка от события
emit(...)	Вызов всех подписчиков события
events	Внутренняя карта подписчиков: { [eventName]: handlers }
EventHandler	Тип функции-обработчика событий
*/