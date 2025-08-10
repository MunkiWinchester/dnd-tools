import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'dnd-radio',
    templateUrl: './radio.component.html',
    styleUrl: './radio.component.scss'
})
export class RadioComponent<T> {
    @Input({ required: true }) value!: T;
    @HostBinding('class.disabled') @Input() disabled?: boolean;

    @HostBinding('class.checked') @Input() checked: boolean = false;

    @ViewChild('cmp') protected focusElement?: ElementRef;

    private cb?: (value: T) => void;

    constructor(
        public elementRef: ElementRef
    ) { }

    @HostListener('click') onClick(): void {
        if (!this.disabled) {
            this.cb?.(this.value);
            this.elementRef.nativeElement.blur();
            this.focusElement?.nativeElement.blur();
        }
    }

    focus(): void {
        this.focusElement?.nativeElement.focus();
    }

    registerClickCallback(cb: (value: T) => void): void {
        this.cb = cb;
    }

    keyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClick();
            event.preventDefault();
            return;
        }
    }
}
