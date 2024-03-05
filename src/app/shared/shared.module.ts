import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppContentComponent } from './components/app-content/app-content.component';
import { ButtonComponent } from './components/button/button.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { ScrollAreaComponent } from './components/scroll-area/scroll-area.component';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
    declarations: [
        ScrollAreaComponent,
        AppContentComponent,
        HeaderBarComponent,
        CurrencyPipe,
        InputNumberComponent,
        ButtonComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forChild()
    ],
    exports: [
        ScrollAreaComponent,
        AppContentComponent,
        HeaderBarComponent,
        CurrencyPipe,
        InputNumberComponent,
        ButtonComponent
    ]
})
export class SharedModule { }
