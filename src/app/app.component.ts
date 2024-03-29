import { Component, OnDestroy } from '@angular/core';
import { environment } from '@environment';
import { InstallPromptService } from '@services/install-prompt.service';
import { ThemeService } from '@services/theme.service';
import { TranslationService } from '@services/translation.service';
import { AssetImage } from '@util/asset-image.enum';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dnd-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {

    private destroy$: Subject<void> = new Subject();

    constructor(
        //#region Services we need to have in the AppComponent
        private themeService: ThemeService,
        private translationService: TranslationService,
        //#endregion Services we need to have in the AppComponent
        private installPromptService: InstallPromptService,
        private iconReg: SvgIconRegistryService
    ) {
        this.registerSVGs();
        this.installPrompt();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private registerSVGs(): void {
        /* eslint-disable rxjs-angular/prefer-async-pipe */
        this.iconReg.loadSvg('assets/images/check.svg', AssetImage.Check)
            ?.pipe(
                takeUntil(this.destroy$)
            )
            .subscribe();
        this.iconReg.loadSvg('assets/images/d20.svg', AssetImage.D20)
            ?.pipe(
                takeUntil(this.destroy$)
            )
            .subscribe();
        this.iconReg.loadSvg('assets/images/d20_multi.svg', AssetImage.D20MULTI)
            ?.pipe(
                takeUntil(this.destroy$)
            )
            .subscribe();
        this.iconReg.loadSvg('assets/images/d20_fill.svg', AssetImage.D20FILL)
            ?.pipe(
                takeUntil(this.destroy$)
            )
            .subscribe();
        /* eslint-enable rxjs-angular/prefer-async-pipe */
    }

    private installPrompt(): void {
        if (environment.production) {
            setTimeout(
                () => {
                    this.installPromptService.addToHomeScreen();
                },
                1000 * 2.5
            );
        }
    }
}
