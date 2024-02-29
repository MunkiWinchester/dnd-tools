import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base/base.component';

@NgModule({
    declarations: [
        BaseComponent
    ],
    imports: [
        CommonModule,
        BaseRoutingModule
    ]
})
export class BaseModule { }
