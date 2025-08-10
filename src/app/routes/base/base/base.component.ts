import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CurrencyService } from '@services/currency.service';
import { DataService } from '@services/data.service';
import { DndRadio } from '@shared/components/radio/radio.types';
import { AssetImage } from '@util/asset-image.enum';
import { Sleep } from '@util/sleep.enum';
import { StorageKey } from '@util/storage-key.enum';
import { Observable, Subject, of, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'dnd-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

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

    //#region Sleep

    radioOptions: Array<DndRadio.Option<Sleep>> = [
        {
            label: 'BASE.SLEEP.VALUES.BAD',
            value: Sleep.Bad
        },
        {
            label: 'BASE.SLEEP.VALUES.NEUTRAL',
            value: Sleep.Neutral
        },
        {
            label: 'BASE.SLEEP.VALUES.GOOD',
            value: Sleep.Good
        },
        {
            label: 'BASE.SLEEP.VALUES.EXCELLENT',
            value: Sleep.Excellent
        }
    ];

    sleep1FormControl: FormControl<Sleep | null>;
    sleep2FormControl: FormControl<Sleep | null>;
    sleep3FormControl: FormControl<Sleep | null>;

    sleepForm: FormGroup;

    //#endregion Sleep

    activeDialog: DialogType = 'resetCurrency';

    isSpecialModeActive$: Observable<boolean> = of(false);
    hasSpecialModeUnlocked: boolean = false;

    readonly ASSET_IMAGE: typeof AssetImage = AssetImage;

    @ViewChild('dialog') protected dialog?: ElementRef<HTMLDialogElement>;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        protected currencyService: CurrencyService,
        private dataService: DataService
    ) {
        this.insp1FormControl = new FormControl(true);
        this.insp2FormControl = new FormControl(false);
        this.insp3FormControl = new FormControl(false);

        this.inspirationForm = this.formBuilder.group({
            insp1: this.insp1FormControl,
            insp2: this.insp2FormControl,
            insp3: this.insp3FormControl
        });


        this.platinumFormControl = new FormControl(null);
        this.goldFormControl = new FormControl(null);
        this.silverFormControl = new FormControl(null);
        this.copperFormControl = new FormControl(null);

        this.currencyForm = this.formBuilder.group({
            platinum: this.platinumFormControl,
            gold: this.goldFormControl,
            silver: this.silverFormControl,
            copper: this.copperFormControl
        });


        this.sleep1FormControl = new FormControl(null);
        this.sleep2FormControl = new FormControl(null);
        this.sleep3FormControl = new FormControl(null);

        this.sleepForm = this.formBuilder.group({
            sleep1: this.sleep1FormControl,
            sleep2: this.sleep2FormControl,
            sleep3: this.sleep3FormControl
        });
    }

    ngOnInit(): void {
        this.listenToValueChanges();
        this.loadValuesFromStorage();
    }

    ngAfterViewInit(): void {
        this.listenToDataService();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showCurrencyResetConfirmDialog(dialogType: DialogType): void {
        switch (dialogType) {
            case 'resetCurrency': {
                if (this.currencyValue !== 0) {
                    this.activeDialog = 'resetCurrency';
                    this.dialog?.nativeElement.showModal();
                }
            }
                break;

            case 'resetSleep': {
                this.activeDialog = 'resetSleep';
                this.dialog?.nativeElement.showModal();
            }
                break;

            default:
                break;
        }

    }

    closeDialog(): void {
        this.dialog?.nativeElement.close();
    }

    updateCurrency(type: '-' | '+' | '0'): void {
        // Reset to 0
        if (type === '0') {
            this.currencyValue = 0;
            this.closeDialog();
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

    resetSleep(): void {
        this.sleepForm.setValue({
            sleep1: null,
            sleep2: null,
            sleep3: null
        });
        this.closeDialog();
    }

    confirmSpecialDialog(): void {
        window.open(
            'https://www.tierschutzbund.de/helfen/spenden/jetzt-spenden#fbform',
            '_blank'
        );

        setTimeout(() => {
            this.hasSpecialModeUnlocked = true;
            this.closeDialog();
        }, 250);
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

        this.sleepForm.valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe(() => {
                localStorage.setItem(StorageKey.Sleep, JSON.stringify(this.sleepForm.value));
            });
    }

    private loadValuesFromStorage(): void {
        this.currencyValue = Number.parseInt(localStorage.getItem(StorageKey.Currency) ?? '0', 10);

        const inspValue: string | null = localStorage.getItem(StorageKey.Inspiration);
        if (inspValue) {
            this.inspirationForm.patchValue(JSON.parse(inspValue) as { [key: string]: unknown });
        }

        const sleepValue: string | null = localStorage.getItem(StorageKey.Sleep);
        if (sleepValue) {
            this.sleepForm.patchValue(JSON.parse(sleepValue) as { [key: string]: unknown });
        }
    }

    private updateAvailableInspirations(): void {
        this.inspirationsAvailable = (this.insp1FormControl.value ? 1 : 0)
            + (this.insp2FormControl.value ? 1 : 0)
            + (this.insp3FormControl.value ? 1 : 0);
    }

    private listenToDataService(): void {
        this.isSpecialModeActive$ = this.dataService.isSpecialModeActive()
            .pipe(
                tap((isSpecialModeActive: boolean) => {
                    if (isSpecialModeActive) {
                        this.activeDialog = 'special';
                        this.dialog?.nativeElement.showModal();
                    }
                })
            );
    }
}

export type DialogType = 'resetCurrency' | 'resetSleep' | 'special';
