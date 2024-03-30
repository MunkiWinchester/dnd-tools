import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgLetModule } from 'ng-let';
import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base/base.component';

@NgModule({
    declarations: [
        BaseComponent
    ],
    imports: [
        AngularSvgIconModule,
        BaseRoutingModule,
        CommonModule,
        FormsModule,
        NgLetModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forChild()
    ]
})
export class BaseModule { }
