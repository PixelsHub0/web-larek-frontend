// src/components/base/Component.ts

/**
 * Абстрактный базовый класс Component<T>
 * 
 * Представляет универсальный компонент интерфейса с базовыми методами,
 * которые могут использоваться в любых UI-компонентах.
 * 
 * Тип T описывает структуру данных, которые можно передавать компоненту
 * при отрисовке.
 */
export abstract class Component<T = object> {
	/**
	 * @param element DOM-элемент, с которым связан компонент
	 */
	protected constructor(protected element: HTMLElement) {}

	/**
	 * Метод для отрисовки компонента. Принимает объект данных и устанавливает
	 * его свойства как параметры текущего экземпляра.
	 * 
	 * @param data Данные для отрисовки компонента (частично или полностью)
	 */
	public render(data?: T): void {
		if (data) this.setProps(data);
	}

	/**
	 * Метод для установки свойств компонента. Использует Object.assign
	 * для копирования свойств из объекта данных в текущий экземпляр.
	 * 
	 * @param data Объект с данными, которые нужно применить к компоненту
	 */
	public setProps(data: Partial<T>) {
		Object.assign(this, data);
	}

	/**
	 * Получение DOM-элемента, связанного с компонентом
	 * 
	 * @returns HTMLElement — корневой DOM-элемент компонента
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Удаление DOM-элемента компонента из DOM-дерева
	 */
	public destroy(): void {
		this.element.remove();
	}

	/**
	 * Установка текстового содержимого элемента
	 * 
	 * @param element DOM-элемент, в который нужно вставить текст
	 * @param value Текстовое значение (любое, будет приведено к строке)
	 */
	protected setText(element: HTMLElement, value: unknown): void {
		element.textContent = String(value);
	}

	/**
	 * Переключает наличие CSS-класса на элементе
	 * @param element Элемент, которому меняем класс
	 * @param className Класс, который нужно добавить или убрать
	 * @param force true — добавить класс, false — убрать
	 */
	protected toggleClass(element: HTMLElement, className: string, force: boolean): void {
		element.classList.toggle(className, force);
	}

	/**
	 * Делает элемент активным или неактивным (disabled).
	 * @param element Элемент (кнопка или поле)
	 * @param isDisabled Нужно ли задизейблить элемент
	 */
	protected setDisabled(element: HTMLElement, isDisabled: boolean): void {
		(element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = isDisabled;
	}

	/**
 	* Устанавливает src и alt для тега <img>.
 	* @param element HTMLImageElement
	 * @param src      URL картинки
 	* @param alt      Alt-текст
 	*/
	protected setImage(element: HTMLImageElement, src: string, alt: string): void {
  	element.src = src;
  	element.alt = alt;
	}
}
