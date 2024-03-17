import { Component, Input } from '@angular/core';
import { CurrencyColor } from '@util/currency.interface';

@Component({
    selector: 'dnd-currency-dot',
    templateUrl: './currency-dot.component.html',
    styleUrl: './currency-dot.component.scss'
})
export class CurrencyDotComponent {
    @Input() color: CurrencyColor | undefined;
}
