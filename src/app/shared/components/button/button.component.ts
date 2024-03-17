import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'dnd-button',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    @Input() disabled: boolean = false;
    @Input() text: string = '';
    @Input() alternateStyle: boolean = false;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click: EventEmitter<MouseEvent> = new EventEmitter();

    @ViewChild('cmp') protected focusElement?: ElementRef;

    constructor(
        public elementRef: ElementRef<HTMLElement>
    ) { }

    emit(event: MouseEvent): void {
        event.stopPropagation();
        this.elementRef.nativeElement.blur();
        this.focusElement?.nativeElement.blur();

        if (!this.disabled) {
            this.click.next(event);
        }
    }

    keyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            // Trigger the button click event
            // We need to provide a mouse event, we use the focus element for that
            const rect: { top: number, left: number } | undefined = this.focusElement?.nativeElement.getBoundingClientRect();
            this.emit(
                new MouseEvent(
                    'click',
                    {
                        clientX: rect?.top,
                        clientY: rect?.left,
                        relatedTarget: this.focusElement?.nativeElement
                    }
                )
            );
            return;
        }
    }
}
