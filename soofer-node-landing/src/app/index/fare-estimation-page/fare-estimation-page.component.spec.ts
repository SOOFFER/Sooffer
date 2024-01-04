import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareEstimationPageComponent } from './fare-estimation-page.component';

describe('FareEstimationPageComponent', () => {
  let component: FareEstimationPageComponent;
  let fixture: ComponentFixture<FareEstimationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareEstimationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareEstimationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
