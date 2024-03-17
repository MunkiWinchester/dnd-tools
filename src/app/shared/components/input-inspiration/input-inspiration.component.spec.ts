import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputInspirationComponent } from './input-inspiration.component';

describe('InputInspirationComponent', () => {
    let component: InputInspirationComponent;
    let fixture: ComponentFixture<InputInspirationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InputInspirationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InputInspirationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
