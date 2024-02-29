import { Component } from '@angular/core';

@Component({
    selector: 'dnd-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent {
    inspirations: Array<IInspiration> = [
        { title: 'Inspiration 1', checked: true },
        { title: 'Inspiration 2', checked: false },
        { title: 'Inspiration 3', checked: false }
    ];

    currency: ICurrency = {
        gold: 0,
        silver: 0,
        copper: 0
    };
}

interface IInspiration {
    title: string;
    checked: boolean;
}

interface ICurrency {
    gold: number;
    silver: number;
    copper: number;
}
