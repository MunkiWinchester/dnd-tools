import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base/base.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        BaseComponent
    ],
    imports: [
        CommonModule,
        BaseRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class BaseModule { }
