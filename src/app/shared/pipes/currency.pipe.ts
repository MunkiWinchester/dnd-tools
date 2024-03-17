import { Pipe, PipeTransform } from '@angular/core';
import { ICurrency } from '@util/currency.interface';

@Pipe({
    name: 'dndCurrency'
})
export class CurrencyPipe implements PipeTransform {

    transform(value: number, factor: number): ICurrency {
        const currency: ICurrency = {
            platinum: 0,
            gold: 0,
            silver: 0,
            copper: 0
        };

        /* eslint-disable @typescript-eslint/typedef */
        ({ currency: currency.copper, remainder: value } = this.calc(value, factor));
        ({ currency: currency.silver, remainder: value } = this.calc(value, factor));
        ({ currency: currency.gold, remainder: value } = this.calc(value, factor));
        currency.platinum = value;
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
