import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appAutoFocusNextSiblingElement]',
})
export class AutoFocusNextSiblingElementDirective {
	@HostListener('keyup', ['$event']) onKeyDown(keyboardEvent: KeyboardEvent) {
		const target = keyboardEvent.target as HTMLInputElement | null;

		if (!target || target.maxLength !== target.value.length) return;

		keyboardEvent.preventDefault();

		const { type } = target;
		let { nextElementSibling } = target;

		while (nextElementSibling) {
			if ((nextElementSibling as HTMLInputElement).type === type) {
				(nextElementSibling as HTMLInputElement).value = '';
				(nextElementSibling as HTMLInputElement).focus();
				return;
			}

			nextElementSibling = nextElementSibling.nextElementSibling;
		}
	}

	constructor() {}
}
