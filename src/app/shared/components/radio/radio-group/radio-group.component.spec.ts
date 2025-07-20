import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
    let component: RadioGroupComponent<number>;
    let fixture: ComponentFixture<RadioGroupComponent<number>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RadioGroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RadioGroupComponent<number>);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
