import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { AssetImage } from '@util/asset-image.enum';
import { Errors } from '@util/util';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-input-inspiration',
    templateUrl: './input-inspiration.component.html',
    styleUrl: './input-inspiration.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: InputInspirationComponent
        }
    ]
})
export class InputInspirationComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    //#region Inputs
    @Input() value: boolean | undefined;
    @Input() disabled: boolean = false;
    @Input() errors?: Errors;
    @Input() renderErrorMsg: boolean = true;
    @Input() required: boolean = false;
    //#endregion Inputs

    @Output() valueChange: EventEmitter<boolean | undefined> = new EventEmitter();

    readonly ASSET_IMAGE: typeof AssetImage = AssetImage;

    @ViewChild('cmp') protected focusElement?: ElementRef;

    private touched: boolean = false;
    private control?: FormControl;
    private destroy$: Subject<void> = new Subject();

    protected get hasFocus(): boolean {
        const active: boolean = document.activeElement === this.focusElement?.nativeElement;
        return active;
    }

    constructor(
        private elementRef: ElementRef,
        private injector: Injector
    ) { }

    ngAfterViewInit(): void {
        const ngControl: NgControl | null = this.injector.get(NgControl, null);
        if (ngControl) {
            this.control = ngControl.control as FormControl;
            setTimeout(() => {
                if (this.control) {
                    this.required = this.control.hasValidator(Validators.required);

                    this.control.statusChanges
                        .pipe(
                            takeUntil(this.destroy$)
                        )
                        // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
                        .subscribe(() => {
                            this.errors = this.control?.errors;
                        });
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    focus(): void {
        this.focusElement?.nativeElement.focus();
    }

    toggle(): void {
        this.valueChanged();
    }

    valueChanged(): void {
        if (!this.disabled) {
            this.markAsTouched();
            this.value = !this.value;
            this.emitValueChange();
            this.elementRef.nativeElement.blur();
            this.focusElement?.nativeElement.blur();
        }
    }

    //#region Control Value Accessor Props
    onChange: (value: boolean | undefined) => void = () => undefined;
    onTouched: () => void = () => undefined;
    onValidatorChange: () => void = () => undefined;
    //#endregion Control Value Accessor Props

    //#region Implemented as part of ControlValueAccessor
    writeValue(value: unknown): void {
        if (_.isBoolean(value)) {
            this.value = value;
        }
        // form.reset passes undefined/null
        if (_.isNil(value)) {
            this.value = undefined;
        }
    }

    registerOnChange(fn: (value: boolean | undefined) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onValidatorChange = fn;
    }
    //#endregion Implemented as part of ControlValueAccessor

    //#region Private, Implemented as part of Validator
    private markAsTouched(): void {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    private emitValueChange(): void {
        this.onChange(this.value);
        this.valueChange.emit(this.value);
        this.onValidatorChange();
    }
    //#endregion Private, Implemented as part of Validator
}
