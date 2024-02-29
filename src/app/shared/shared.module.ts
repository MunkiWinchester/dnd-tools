import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppContentComponent } from './components/app-content/app-content.component';
import { ScrollAreaComponent } from './components/scroll-area/scroll-area.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
    declarations: [
        ScrollAreaComponent,
        AppContentComponent,
        HeaderBarComponent,
        CurrencyPipe
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
        CurrencyPipe
    ]
})
export class SharedModule { }
