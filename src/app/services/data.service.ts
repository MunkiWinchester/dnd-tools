import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '@util/data.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { version } from '../../../package.json';

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

    private init(): void {
        this.httpClient.get<IData>(`assets/data/data.json?v=${version}`)
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe((data: IData) => {
                this.data$.next(data);
            });
    }
}
