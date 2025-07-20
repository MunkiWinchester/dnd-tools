import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '@services/data.service';
import { IData } from '@util/data.interface';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Subject, takeUntil, timer } from 'rxjs';

dayjs.extend(duration);
dayjs.extend(localizedFormat);

@Component({
    selector: 'dnd-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent implements OnInit, OnDestroy {
    durationTillNextSession: duration.Duration = dayjs.duration({ milliseconds: 0 });

    nextSession: Dayjs = dayjs();

    @ViewChild('dialog') protected dialog?: ElementRef<HTMLDialogElement>;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit(): void {
        this.loadValues();
        this.initTimeTillNextSession();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openDialog(): void {
        this.dialog?.nativeElement.showModal();
    }

    closeDialog(): void {
        this.dialog?.nativeElement.close();
    }

    private loadValues(): void {
        this.dataService.loadData()
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe((data: IData) => {
                this.nextSession = dayjs(data.NEXT_SESSION);
                this.updateDurationTillNextSession();
            });
    }

    private initTimeTillNextSession(): void {
        const now: Dayjs = dayjs();
        const durationToNextMin: number = now
            .add(1, 'minute')
            .second(0)
            .diff(now, 'millisecond');

        timer(
            durationToNextMin,
            60 * 1000 // 1 minute
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe(() => {
                this.updateDurationTillNextSession();
            });
    }

    private updateDurationTillNextSession(): void {
        this.durationTillNextSession = dayjs.duration(
            this.nextSession.diff(
                dayjs()
                    .second(0)
                    .subtract(1, 'second')
            )
        );
    }
}
