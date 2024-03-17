import { Component, OnDestroy, OnInit } from '@angular/core';
import { NEXT_SESSION } from '@assets/data/data.json';
import { environment } from '@environment';
import { AppApplicableTheme, AppTheme, ThemeService } from '@services/theme.service';
import { StorageKey } from '@util/storage-key.enum';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Subject, takeUntil, timer } from 'rxjs';
dayjs.extend(duration);

@Component({
    selector: 'dnd-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent implements OnInit, OnDestroy {
    durationTillNextSession: duration.Duration = dayjs.duration({ milliseconds: 0 });

    protected isDevMode: boolean = false;

    private nextSession: Dayjs = dayjs();
    private destroy$: Subject<void> = new Subject();

    constructor(
        private themeService: ThemeService
    ) {
        this.isDevMode = !environment.production;
    }

    ngOnInit(): void {
        this.loadValuesFromStorage();
        this.initTimeTillNextSession();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    switchTheme(): void {
        const theme: AppApplicableTheme = this.themeService.getAppliedTheme();
        this.themeService.switchTheme(
            theme === AppTheme.VhsReggaeDark
                ? AppTheme.VhsReggaeLight
                : AppTheme.VhsReggaeDark
        );
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
