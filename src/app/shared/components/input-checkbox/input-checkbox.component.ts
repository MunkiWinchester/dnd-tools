import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { AssetImage } from '@util/asset-image.enum';
import { Errors } from '@util/util';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-input-checkbox',
    templateUrl: './input-checkbox.component.html',
    styleUrl: './input-checkbox.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: InputCheckboxComponent
        }
    ]
})
export class InputCheckboxComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    @Input() errors?: Errors;
    @Input() label: string = '';
    @Input() required: boolean = false;
    @HostBinding('class.disabled') @Input() disabled: boolean = false;
    @HostBinding('class.checked') @Input() value: boolean = false;
    @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

    /**
     * Optional parameters for the label
     *
     * For example: `{ count: 2 }`
     */
    /* eslint-disable @typescript-eslint/ban-types */
    @Input() labelInterpolateParams?: Object;

    readonly ASSET_IMAGE: typeof AssetImage = AssetImage;

    @ViewChild('cmp') protected focusElement?: ElementRef;

    private touched: boolean = false;
    private control?: FormControl;
    private destroy$: Subject<void> = new Subject();

    constructor(
        private elementRef: ElementRef,
        private injector: Injector
    ) { }

    @HostListener('click') onClick(): void {
        if (!this.disabled) {
            this.markAsTouched();
            this.value = !this.value;
            this.emitValueChange();
            this.elementRef.nativeElement.blur();
            this.focusElement?.nativeElement.blur();
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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    keyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClick();
            event.preventDefault();
            return;
        }
    }

    //#region Implemented as part of ControlValueAccessor
    writeValue(value: unknown): void {
        if (_.isBoolean(value)) {
            this.value = value;
        }
        // form.reset passes undefined/null
        if (_.isNil(value)) {
            this.value = false;
        }
    }

    registerOnChange(fn: (value: boolean) => void): void {
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

    //#region Control Value Accessor Props
    onChange: (value: boolean) => void = () => undefined;
    onTouched: () => void = () => undefined;
    onValidatorChange: () => void = () => undefined;
    //#endregion Control Value Accessor Props

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
