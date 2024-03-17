/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ICurrency } from '@util/currency.interface';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private _usesPlatinum!: boolean;
    private _usesPlatinum$: ReplaySubject<boolean>
        = new ReplaySubject(1);

    get usesPlatinum$(): Observable<boolean> {
        return this._usesPlatinum$.asObservable();
    }

    get usesPlatinum(): boolean {
        return this._usesPlatinum;
    }

    set usesPlatinum(value: boolean) {
        if (this.usesPlatinum !== value) {
            this._usesPlatinum = value;
            this._usesPlatinum$.next(this._usesPlatinum);
        }
    }

    constructor() {
        this.usesPlatinum = false;
    }

    calculate(value: number, factor: number): ICurrency {
        const currency: ICurrency = {
            platinum: 0,
            gold: 0,
            silver: 0,
            copper: 0
        };

        /* eslint-disable @typescript-eslint/typedef */

        ({ currency: currency.copper, remainder: value } = this.calculateAmountAndRemainder(value, factor));
        ({ currency: currency.silver, remainder: value } = this.calculateAmountAndRemainder(value, factor));

        if (this._usesPlatinum) {
            ({ currency: currency.gold, remainder: value } = this.calculateAmountAndRemainder(value, factor));
            currency.platinum = value;
        }
        else {
            currency.gold = value;
        }

        /* eslint-enable @typescript-eslint/typedef */

        return currency;
    }

    private calculateAmountAndRemainder(value: number, factor: number): { currency: number, remainder: number } {
        return {
            currency: value % factor,
            remainder: Math.trunc(value / factor)
        };
    }
}
