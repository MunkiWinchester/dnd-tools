import { Component, OnDestroy } from '@angular/core';
import { environment } from '@environment';
import { InstallPromptService } from '@services/install-prompt.service';
import { SvgService } from '@services/svg.service';
import { ThemeService } from '@services/theme.service';
import { TranslationService } from '@services/translation.service';
import { Subject } from 'rxjs';

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
        private svgService: SvgService,
        private installPromptService: InstallPromptService
    ) {
        this.svgService.registerSVGs();
        this.installPrompt();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
