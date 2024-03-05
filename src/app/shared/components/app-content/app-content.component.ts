import { Component, ElementRef, ViewChild } from '@angular/core';
import dataJson from '@assets/data/data.json';
import { DndVersion } from '@util/version.class';

@Component({
    selector: 'dnd-app-content',
    templateUrl: './app-content.component.html',
    styleUrl: './app-content.component.scss'
})
export class AppContentComponent {
    @ViewChild('appContainer', { static: true }) appContainer: ElementRef<HTMLElement> | undefined;

    version: DndVersion;

    constructor() {
        this.version = new DndVersion(
            dataJson.BUILD_VERSION as string,
            dataJson.BUILD_NO as number,
            dataJson.BUILD_TIME as number
        );
    }
}
