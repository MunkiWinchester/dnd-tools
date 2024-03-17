import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CurrencyService } from '@services/currency.service';
import { AssetImage } from '@util/asset-image.enum';
import { StorageKey } from '@util/storage-key.enum';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy {

    //#region Inspirations

    inspirationsAvailable: number = 1;
    inspirationsTotal: number = 3;

    insp1FormControl: FormControl<boolean | null>;
    insp2FormControl: FormControl<boolean | null>;
    insp3FormControl: FormControl<boolean | null>;

    inspirationForm: FormGroup;

    //#endregion Inspirations

    //#region Currency

    currencyValue: number = 0;
    currencyFactor: number = 10;

    platinumFormControl: FormControl<number | null>;
    goldFormControl: FormControl<number | null>;
    silverFormControl: FormControl<number | null>;
    copperFormControl: FormControl<number | null>;

    currencyForm: FormGroup;

    //#endregion Currency

    readonly ASSET_IMAGE: typeof AssetImage = AssetImage;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        protected currencyService: CurrencyService
    ) {
        this.insp1FormControl = new FormControl(
            true
        );
        this.insp2FormControl = new FormControl(
            false
        );
        this.insp3FormControl = new FormControl(
            false
        );

        this.inspirationForm = this.formBuilder.group({
            insp1: this.insp1FormControl,
            insp2: this.insp2FormControl,
            insp3: this.insp3FormControl
        });

        this.platinumFormControl = new FormControl(
            null
        );
        this.goldFormControl = new FormControl(
            null
        );
        this.silverFormControl = new FormControl(
            null
        );
        this.copperFormControl = new FormControl(
            null
        );

        this.currencyForm = this.formBuilder.group({
            platinum: this.platinumFormControl,
            gold: this.goldFormControl,
            silver: this.silverFormControl,
            copper: this.copperFormControl
        });
    }

    ngOnInit(): void {
        this.listenToValueChanges();
        this.loadValuesFromStorage();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateCurrency(type: '-' | '+' | '0'): void {
        // Reset to 0
        if (type === '0') {
            this.currencyValue = 0;
        }
        else {
            const operator: number = (type === '-' ? -1 : 1);
            this.currencyValue += operator * (this.copperFormControl.value ?? 0);
            this.currencyValue += operator * (this.silverFormControl.value ?? 0) * this.currencyFactor;
            this.currencyValue += operator * (this.goldFormControl.value ?? 0) * Math.pow(this.currencyFactor, 2);
            this.currencyValue += operator * (this.platinumFormControl.value ?? 0) * Math.pow(this.currencyFactor, 3);
        }

        localStorage.setItem(StorageKey.Currency, String(this.currencyValue));
        this.currencyForm.reset();
    }

    private listenToValueChanges(): void {
        this.inspirationForm.valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe(() => {
                localStorage.setItem(StorageKey.Inspiration, JSON.stringify(this.inspirationForm.value));
                this.updateAvailableInspirations();
            });
    }

    private loadValuesFromStorage(): void {
        this.currencyValue = Number.parseInt(localStorage.getItem(StorageKey.Currency) ?? '0', 10);

        const inspValue: string | null = localStorage.getItem(StorageKey.Inspiration);
        if (inspValue) {
            this.inspirationForm.patchValue(JSON.parse(inspValue) as { [key: string]: unknown });
        }
    }

    private updateAvailableInspirations(): void {
        this.inspirationsAvailable = (this.insp1FormControl.value ? 1 : 0)
            + (this.insp2FormControl.value ? 1 : 0)
            + (this.insp3FormControl.value ? 1 : 0);
    }
}
