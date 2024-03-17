import { Component, Input } from '@angular/core';

@Component({
    selector: 'dnd-currency-display',
    templateUrl: './currency-display.component.html',
    styleUrl: './currency-display.component.scss'
})
export class CurrencyDisplayComponent {
    @Input() currencyValue: number = 0;
    @Input() currencyFactor: number = 10;
    @Input() useCurrencyDot: boolean = false;
}
