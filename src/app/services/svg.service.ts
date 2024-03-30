import { Injectable } from '@angular/core';
import { AssetImage } from '@util/asset-image.enum';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    constructor(
        private iconReg: SvgIconRegistryService
    ) { }

    registerSVGs(): void {
        /* eslint-disable rxjs-angular/prefer-async-pipe */
        this.iconReg.loadSvg('assets/images/check.svg', AssetImage.Check)
            ?.subscribe();
        this.iconReg.loadSvg('assets/images/d20.svg', AssetImage.D20)
            ?.subscribe();
        this.iconReg.loadSvg('assets/images/d20_multi.svg', AssetImage.D20MULTI)
            ?.subscribe();
        this.iconReg.loadSvg('assets/images/d20_fill.svg', AssetImage.D20FILL)
            ?.subscribe();
        /* eslint-enable rxjs-angular/prefer-async-pipe */
    }
}
