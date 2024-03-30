import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '@util/data.interface';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Observable, ReplaySubject, map } from 'rxjs';
import { version } from '../../../package.json';
dayjs.extend(isBetween);

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data$: ReplaySubject<IData> = new ReplaySubject(1);

    constructor(
        private httpClient: HttpClient
    ) {
        this.init();
    }

    loadData(): Observable<IData> {
        return this.data$.asObservable();
    }

    isSpecialModeActive(): Observable<boolean> {
        return this.data$.pipe(
            map((data: IData) =>
                dayjs()
                    .isBetween(
                        dayjs(data.SPECIAL_MODE.FROM),
                        dayjs(data.SPECIAL_MODE.TO),
                        'second'
                    )
            )
        );
    }

    private init(): void {
        this.httpClient.get<IData>(`assets/data/data.json?v=${version}`)
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe((data: IData) => {
                this.data$.next(data);
            });
    }
}
