import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageKey } from '@util/storage-key.enum';
import { Subject, takeUntil } from 'rxjs';
import { AssetImage } from 'src/app/util/asset-image.enum';

@Component({
    selector: 'dnd-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy {

    //#region Inspirations

    inspirationsAvailable: number = 1;
    inspirationsTotal: number = 3;

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

    readonly ASSET_IMAGE: typeof AssetImage = AssetImage;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.listenToValueChanges();
        this.loadValuesFromStorage();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateCurrency(type: '-' | '+'): void {
        const operator: number = (type === '-' ? -1 : 1);
        this.currencyValue += operator * (this.copperFormControl.value ?? 0);
        this.currencyValue += operator * (this.silverFormControl.value ?? 0) * this.currencyFactor;
        this.currencyValue += operator * (this.goldFormControl.value ?? 0) * (this.currencyFactor * this.currencyFactor);

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
