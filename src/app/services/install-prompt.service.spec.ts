import { TestBed } from '@angular/core/testing';
import { InstallPromptService } from './install-prompt.service';

describe('InstallPromptService', () => {
    let service: InstallPromptService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InstallPromptService);
    });

    it('should be created', () => {
        expect(service)
            .toBeTruthy();
    });
});
