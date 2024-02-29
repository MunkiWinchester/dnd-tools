import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, distinctUntilChanged, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScreenSizeService {

    private static readonly MIN_CONTENT_WIDTH_FOR_SPLITPANE: number = 1208;
    private static readonly SIDEBAR_WIDTH: number = 252;
    private static readonly PADDING: number = 80;

    private static readonly MOBILE_BREAKPOINT_WIDTH: number = 768;

    private screenSize$: ReplaySubject<AppScreenSize> = new ReplaySubject(1);
    private showSplitpane$: ReplaySubject<boolean> = new ReplaySubject(1);
    private mobileQuery: MediaQueryList;
    private showSplitpaneQuery: MediaQueryList;


    constructor(media: MediaMatcher) {
        this.mobileQuery = media.matchMedia(`(max-width: ${ScreenSizeService.MOBILE_BREAKPOINT_WIDTH}px)`);
        this.mobileQuery.addEventListener<'change'>('change', () => { this.emit(); });

        this.showSplitpaneQuery = media.matchMedia(`(min-width: ${ScreenSizeService.getMinPageWidthForSplitpane()}px)`);
        this.showSplitpaneQuery.addEventListener<'change'>('change', () => { this.emitSplitpane(); });

        this.emit();
        this.emitSplitpane();
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

    showSplitpanes(): Observable<boolean> {
        return this.showSplitpane$.asObservable();
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static getMinPageWidthForSplitpane(): number {
        return ScreenSizeService.MIN_CONTENT_WIDTH_FOR_SPLITPANE + ScreenSizeService.SIDEBAR_WIDTH + ScreenSizeService.PADDING;
    }

    private emitSplitpane(): void {
        this.showSplitpane$.next(this.showSplitpaneQuery.matches);
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
