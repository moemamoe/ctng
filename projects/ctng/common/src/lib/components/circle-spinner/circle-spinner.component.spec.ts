import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleSpinnerComponent } from './circle-spinner.component';

describe('CircleSpinnerComponent', () => {
  let component: CircleSpinnerComponent;
  let fixture: ComponentFixture<CircleSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
