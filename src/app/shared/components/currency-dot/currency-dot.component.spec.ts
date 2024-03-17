import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyDotComponent } from './currency-dot.component';

describe('CurrencyDotComponent', () => {
    let component: CurrencyDotComponent;
    let fixture: ComponentFixture<CurrencyDotComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CurrencyDotComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CurrencyDotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
