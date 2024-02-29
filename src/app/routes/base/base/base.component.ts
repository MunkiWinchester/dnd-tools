import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy {
    //#region Inspirations

    insp1FormControl: FormControl<boolean | null> = new FormControl(
        true
    );
    insp2FormControl: FormControl<boolean | null> = new FormControl(
        false
    );
    insp3FormControl: FormControl<boolean | null> = new FormControl(
        false
    );

    inspirationForm: FormGroup = this.formBuilder.group({
        insp1: this.insp1FormControl,
        insp2: this.insp2FormControl,
        insp3: this.insp3FormControl
    });

    //#endregion Inspirations

    //#region Currency

    currencyValue: number = 0;
    currencyFactor: number = 10;

    goldFormControl: FormControl<number | null> = new FormControl(
        null
    );
    silverFormControl: FormControl<number | null> = new FormControl(
        null,
        [
            Validators.min(-9),
            Validators.max(9)
        ]
    );
    copperFormControl: FormControl<number | null> = new FormControl(
        null,
        [
            Validators.min(-9),
            Validators.max(9)
        ]
    );

    currencyForm: FormGroup = this.formBuilder.group({
        gold: this.goldFormControl,
        silver: this.silverFormControl,
        copper: this.copperFormControl
    });

    //#endregion Currency

    private destroy$: Subject<void> = new Subject();

    private readonly INSP_KEY: string = 'inspiration';
    private readonly CURR_KEY: string = 'currency';

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.currencyValue = Number.parseInt(localStorage.getItem(this.CURR_KEY) ?? '0', 10);
        const inspValue: string | null = localStorage.getItem(this.INSP_KEY);
        if (inspValue) {
            this.inspirationForm.patchValue(JSON.parse(inspValue) as { [key: string]: unknown });
        }

        this.inspirationForm.valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe(() => {
                localStorage.setItem(this.INSP_KEY, JSON.stringify(this.inspirationForm.value));
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateCurrency(): void {
        this.currencyValue += this.copperFormControl.value ?? 0;
        this.currencyValue += (this.silverFormControl.value ?? 0) * this.currencyFactor;
        this.currencyValue += (this.goldFormControl.value ?? 0) * (this.currencyFactor * this.currencyFactor);

        localStorage.setItem(this.CURR_KEY, String(this.currencyValue));
        this.currencyForm.reset();
    }
}
