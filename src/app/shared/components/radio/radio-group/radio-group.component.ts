/* eslint-disable no-underscore-dangle */
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Errors } from '@util/util';
import _ from 'lodash';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DndRadio } from '../radio.types';
import { RadioComponent } from '../radio/radio.component';

@Component({
    selector: 'dnd-radio-group',
    templateUrl: './radio-group.component.html',
    styleUrl: './radio-group.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: RadioGroupComponent
        }
    ]
})
export class RadioGroupComponent<T> implements AfterContentInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() label?: string;
    /**
     * Optional parameters for the label
     *
     * For example: `{ value: 1 }`
     */
    /* eslint-disable @typescript-eslint/ban-types */
    @Input() labelInterpolateParams?: Object;
    @Input() caption?: string;
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() options?: Array<DndRadio.Option<T>>;
    @Input() errors?: Errors;
    @Input() renderErrorMsg: boolean = true;

    @Output() valueChange: EventEmitter<T> = new EventEmitter();

    @ViewChildren(RadioComponent) radiosView: QueryList<RadioComponent<T>> = new QueryList();
    @ContentChildren(RadioComponent) radiosContent: QueryList<RadioComponent<T>> = new QueryList();

    protected control?: FormControl;
    protected destroy$: Subject<void> = new Subject();

    protected touched: boolean = false;

    private queryList: QueryList<RadioComponent<T>> = new QueryList();

    /* eslint-disable @typescript-eslint/member-ordering */
    private _value: T | undefined;
    get value(): T | undefined {
        return this._value;
    }
    @Input() set value(value: T | undefined) {
        this.markAsTouched();
        this._value = value;
        if (!_.isUndefined(this.radiosContent)) {
            this.updateRadiosState(this.value);
        }
        // This would be a reset
        if (!_.isUndefined(this._value)) {
            this.emitValueChange();
        }
    }
    /* eslint-enable @typescript-eslint/member-ordering */

    constructor(
        private injector: Injector
    ) { }

    ngAfterContentInit(): void {
        if (!this.options) {
            this.queryList = this.radiosContent;
            setTimeout(() => {
                this.afterInit(true);
            });
        }
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

        if (this.options?.length) {
            this.queryList = this.radiosView;
            setTimeout(() => {
                this.afterInit(true);
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    isEqual(value: T, newValue: T | undefined | unknown): boolean {
        return _.isEqual(value, newValue);
    }

    isDisabled(option: DndRadio.Option<T>): boolean {
        return !!option.disabled;
    }

    focus(): void {
        this.queryList.first.focus();
    }

    //#region Control Value Accessor Props
    onChange: (value: T | undefined) => void = () => undefined;
    onTouched: () => void = () => undefined;
    onValidatorChange: () => void = () => undefined;
    //#endregion Control Value Accessor Props

    //#region Implemented as part of ControlValueAccessor
    writeValue(value: unknown): void {
        if (_.isUndefined(value) || this.includes(value)) {
            this.value = value as T | undefined;
        }
        // form.reset passes undefined/null
        if (_.isNil(value)) {
            this.value = undefined;
        }
    }

    registerOnChange(fn: (value: T | undefined) => void): void {
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

    private listenOnRadiosClick(): void {
        this.queryList.forEach((radio: RadioComponent<T>) => {
            radio.registerClickCallback((value: T) => {
                if (!this.disabled) {
                    this.value = value;
                }
            });
        });
    }

    private updateRadiosState(newValue: T | undefined): void {
        this.queryList.forEach((radio: RadioComponent<T>) => {
            radio.checked = this.isEqual(radio.value, newValue);

            if (this.disabled) {
                (radio.elementRef.nativeElement as HTMLElement).classList.add('group-disabled');
                radio.disabled = true;
            }
            else {
                (radio.elementRef.nativeElement as HTMLElement).classList.remove('group-disabled');
            }
        });
    }

    private afterInit(setInitialState: boolean = false): void {
        this.listenOnRadiosClick();

        if (setInitialState) {
            if (!_.isUndefined(this.value) && !this.includes(this.value)) {
                this.value = undefined;
            }
            this.updateRadiosState(this.value);
        }

        this.queryList.changes
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe, rxjs/no-ignored-subscription
            .subscribe(() => {
                this.listenOnRadiosClick();
                this.updateRadiosState(this.value);
            });
    }

    private includes(value: unknown): boolean {
        // If we have options check if they include the value
        if (this.options?.length) {
            return _.some(this.options, (option: DndRadio.Option<T>) => this.isEqual(option.value, value));
        }

        // If we already have the query list check if they include the value
        if (this.queryList.length) {
            return this.queryList.some((radio: RadioComponent<T>) => {
                if (this.isEqual(radio.value, value)) {
                    radio.checked = true;
                    return true;
                }
                return false;
            });
        }

        // Else we return true and let the afterInit handle the check
        return true;
    }
}
