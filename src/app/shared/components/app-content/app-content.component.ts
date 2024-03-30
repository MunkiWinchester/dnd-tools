import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '@services/data.service';
import { IData } from '@util/data.interface';
import { DndVersion } from '@util/version.class';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-app-content',
    templateUrl: './app-content.component.html',
    styleUrl: './app-content.component.scss'
})
export class AppContentComponent implements OnInit, OnDestroy {
    @ViewChild('appContainer', { static: true }) appContainer: ElementRef<HTMLElement> | undefined;

    version: DndVersion | undefined;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit(): void {
        this.dataService.loadData()
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe((data: IData) => {
                this.version = new DndVersion(
                    data.BUILD_VERSION,
                    data.BUILD_NO,
                    data.BUILD_TIME
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
