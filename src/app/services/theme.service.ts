import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private currentTheme: AppTheme = AppTheme.System;
    private appliedTheme: AppApplicableTheme = AppTheme.Dark;
    private darkThemeQuery: MediaQueryList;

    // Normally we use Replay, but here we don't want to replay it and also no initial value
    private themeChanged$: Subject<AppTheme> = new Subject();

    private body!: HTMLBodyElement;

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        media: MediaMatcher
    ) {
        this.body = this.document.body as HTMLBodyElement;

        this.darkThemeQuery = media.matchMedia(`(prefers-color-scheme: dark)`);
        this.darkThemeQuery.addEventListener<'change'>('change', () => {
            this.applyPreferredColorScheme();
        });

        this.loadSelectedTheme();
    }

    onThemeChange(): Observable<AppTheme> {
        return this.themeChanged$.asObservable();
    }

    getAppliedTheme(): AppApplicableTheme {
        return this.appliedTheme;
    }

    getCurrentTheme(): AppTheme {
        return this.currentTheme;
    }

    getCurrentThemeIcon(): string {
        switch (this.appliedTheme) {
            case AppTheme.Light:
            case AppTheme.VaporWaveSunsetLight:
            case AppTheme.VhsReggaeLight:
            case AppTheme.DoggoSnacksLight:
            case AppTheme.RitualMagicLight:
            case AppTheme.MonsterManualLight:
            case AppTheme.BloodInTheWaterLight:
                return 'sun';
            case AppTheme.Dark:
            case AppTheme.VaporWaveSunsetDark:
            case AppTheme.VhsReggaeDark:
            case AppTheme.DoggoSnacksDark:
            case AppTheme.RitualMagicDark:
            case AppTheme.MonsterManualDark:
            case AppTheme.BloodInTheWaterDark:
                return 'moon';
            default:
                return 'auto';
        }
    }

    getAvailableThemes(): Array<AppTheme> {
        return Object.values(AppTheme);
    }

    switchTheme(theme: AppTheme): void {
        this.body.classList.add('theme-transition');

        this.currentTheme = this.isAppTheme(theme)
            ? theme
            : AppTheme.System;
        this.appliedTheme = this.currentTheme === AppTheme.System
            ? this.getSystemTheme()
            : this.currentTheme;

        this.document.documentElement.setAttribute(
            'data-theme',
            this.appliedTheme as string
        );

        setTimeout(() => {
            this.body.classList.remove('theme-transition');
        }, 1000);

        this.saveSelectedTheme();
        this.themeChanged$.next(this.currentTheme);
    }

    private getSystemTheme(): AppApplicableTheme {
        return this.darkThemeQuery.matches
            ? AppTheme.VhsReggaeDark
            : AppTheme.VhsReggaeLight;
    }

    private loadSelectedTheme(): void {
        const savedTheme: AppTheme = (localStorage.getItem('theme') ?? 'system') as AppTheme;
        this.switchTheme(savedTheme);
    }

    private saveSelectedTheme(): void {
        localStorage.setItem('theme', this.currentTheme);
    }

    private applyPreferredColorScheme(): void {
        if (this.currentTheme === AppTheme.System) {
            this.switchTheme(AppTheme.System);
        }
    }

    private isAppTheme(theme: unknown): theme is AppTheme {
        return Object.values(AppTheme)
            .includes(theme as AppTheme);
    }
}

export enum AppTheme {
    BloodInTheWaterDark = 'blood-in-the-water-dark',
    BloodInTheWaterLight = 'blood-in-the-water-light',
    Dark = 'dark',
    DoggoSnacksDark = 'doggo-snacks-dark',
    DoggoSnacksLight = 'doggo-snacks-light',
    Light = 'light',
    MonsterManualDark = 'monster-manual-dark',
    MonsterManualLight = 'monster-manual-light',
    RitualMagicDark = 'ritual-magic-dark',
    RitualMagicLight = 'ritual-magic-light',
    System = 'system',
    VaporWaveSunsetDark = 'vapor-wave-sunset-dark',
    VaporWaveSunsetLight = 'vapor-wave-sunset-light',
    VhsReggaeDark = 'vhs-reggae-dark',
    VhsReggaeLight = 'vhs-reggae-light'
}

export type AppApplicableTheme = Exclude<AppTheme, AppTheme.System>;
