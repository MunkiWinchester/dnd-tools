import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
    it('create an instance', () => {
        const pipe: CurrencyPipe = new CurrencyPipe();
        expect(pipe)
            .toBeTruthy();
    });
});
