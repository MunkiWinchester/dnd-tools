import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageKey } from '@util/storage-key.enum';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { NEXT_SESSION } from '../../../../assets/data/data.json';
import { Subject, timer, takeUntil } from 'rxjs';
dayjs.extend(duration);

@Component({
    selector: 'dnd-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent implements OnInit, OnDestroy {
    durationTillNextSession: duration.Duration = dayjs.duration({ milliseconds: 0 });

    private nextSession: Dayjs = dayjs();
    private destroy$: Subject<void> = new Subject();

    ngOnInit(): void {
        this.loadValuesFromStorage();
        this.initTimeTillNextSession();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadValuesFromStorage(): void {
        this.nextSession = dayjs(
            localStorage.getItem(StorageKey.NextSession) ?? (NEXT_SESSION as string)
        );
        this.updateDurationTillNextSession();
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
            this.nextSession.diff(dayjs())
        );
    }
}
