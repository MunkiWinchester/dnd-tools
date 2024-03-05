import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Errors } from '@util/util';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-input-number',
    templateUrl: './input-number.component.html',
    styleUrl: './input-number.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: InputNumberComponent
        }
    ]
})
export class InputNumberComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    //#region Inputs
    @Input() value: number | undefined;
    @Input() disabled: boolean = false;
    @Input() errors?: Errors;
    @Input() renderErrorMsg: boolean = true;
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() required: boolean = false;

    //#region Interpolate params

    /**
     * Optional parameters for the caption
     *
     * For example: `{ count: 2 }`
     */
    /* eslint-disable @typescript-eslint/ban-types */
    @Input() captionInterpolateParams?: Object;
    /**
     * Optional parameters for the label
     *
     * For example: `{ count: 2 }`
     */
    /* eslint-disable @typescript-eslint/ban-types */
    @Input() labelInterpolateParams?: Object;
    /**
     * Optional parameters for the placeholder
     *
     * For example: `{ count: 2 }`
     */
    /* eslint-disable @typescript-eslint/ban-types */
    @Input() placeholderInterpolateParams?: Object;

    //#endregion Interpolate params
    //#endregion Inputs

    @Output() valueChange: EventEmitter<number | undefined> = new EventEmitter();

    @ViewChild('cmp') protected focusElement?: ElementRef;

    private touched: boolean = false;
    private control?: FormControl;
    private destroy$: Subject<void> = new Subject();

    protected get hasFocus(): boolean {
        const active: boolean = document.activeElement === this.focusElement?.nativeElement;
        return active;
    }

    constructor(
        private injector: Injector
    ) { }

    focus(): void {
        this.focusElement?.nativeElement.focus();
    }


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

    valueChanged(event: Event): void {
        this.markAsTouched();
        const value: number = (event.target as HTMLInputElement).valueAsNumber;
        this.value = _.isNumber(value) && !_.isNaN(value) ? value : undefined;
        this.emitValueChange();
    }

    //#region Control Value Accessor Props
    onChange: (value: number | undefined) => void = () => undefined;
    onTouched: () => void = () => undefined;
    onValidatorChange: () => void = () => undefined;
    //#endregion Control Value Accessor Props

    //#region Implemented as part of ControlValueAccessor
    writeValue(value: unknown): void {
        if (_.isNumber(value)) {
            this.value = value;
        }
        // form.reset passes undefined/null
        if (_.isNil(value)) {
            this.value = undefined;
        }
    }

    registerOnChange(fn: (value: number | undefined) => void): void {
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
