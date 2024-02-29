import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'dnd-app-content',
    templateUrl: './app-content.component.html',
    styleUrl: './app-content.component.scss'
})
export class AppContentComponent {
    @ViewChild('appContainer', { static: true }) appContainer: ElementRef<HTMLElement> | undefined;
}
