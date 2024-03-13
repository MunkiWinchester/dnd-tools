import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, distinctUntilChanged, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScreenSizeService {

    private static readonly MOBILE_BREAKPOINT_WIDTH: number = 768;

    private screenSize$: ReplaySubject<AppScreenSize> = new ReplaySubject(1);
    private mobileQuery: MediaQueryList;


    constructor(media: MediaMatcher) {
        this.mobileQuery = media.matchMedia(`(max-width: ${ScreenSizeService.MOBILE_BREAKPOINT_WIDTH}px)`);
        this.mobileQuery.addEventListener<'change'>('change', () => { this.emit(); });

        this.emit();
    }

    getScreenSize(): Observable<AppScreenSize> {
        return this.screenSize$.asObservable();
    }

    isMobile(): Observable<boolean> {
        return this.getScreenSize()
            .pipe(
                map((size: AppScreenSize) => size === AppScreenSize.Mobile),
                distinctUntilChanged()
            );
    }

    private emit(): void {
        this.screenSize$.next(
            this.mobileQuery.matches
                ? AppScreenSize.Mobile
                : AppScreenSize.Desktop
        );
    }
}

export enum AppScreenSize {
    Mobile = 'mobile',
    Desktop = 'desktop'
}
