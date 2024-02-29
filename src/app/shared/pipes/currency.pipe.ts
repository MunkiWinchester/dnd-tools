import { Pipe, PipeTransform } from '@angular/core';
import { ICurrency } from '@interfaces/currency';

@Pipe({
    name: 'dndCurrency'
})
export class CurrencyPipe implements PipeTransform {

    transform(value: number, factor: number): ICurrency {
        const currency: ICurrency = {
            gold: 0,
            silver: 0,
            copper: 0
        };

        /* eslint-disable @typescript-eslint/typedef */
        ({ currency: currency.copper, remainder: value } = this.calc(value, factor));
        ({ currency: currency.silver, remainder: value } = this.calc(value, factor));
        currency.gold = value;
        /* eslint-enable @typescript-eslint/typedef */

        return currency;
    }

    private calc(value: number, factor: number): { currency: number, remainder: number } {
        return {
            currency: value % factor,
            remainder: Math.trunc(value / factor)
        };
    }
}
