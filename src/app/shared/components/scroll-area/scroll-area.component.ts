import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'dnd-scroll-area',
    templateUrl: './scroll-area.component.html',
    styleUrl: './scroll-area.component.scss'
})
export class ScrollAreaComponent {
    @Output() contentScroll: EventEmitter<ScrollArea.ScrollEvent> = new EventEmitter();

    /**
     * This is being called from the template
     */
    protected emitScroll(event: Event, bodyType: ScrollArea.BodyType): void {
        const scrollEvent: ScrollArea.ScrollEvent = {
            event: event,
            bodyType: bodyType
        };

        this.contentScroll.next(scrollEvent);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScrollArea {
    export type BodyType = 'header' | 'content' | 'footer';
    export type ScrollEvent = { event: Event, bodyType: ScrollArea.BodyType };
}
