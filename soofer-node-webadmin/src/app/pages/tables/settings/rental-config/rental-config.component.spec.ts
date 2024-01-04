import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalConfigComponent } from './rental-config.component';

describe('RentalConfigComponent', () => {
  let component: RentalConfigComponent;
  let fixture: ComponentFixture<RentalConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
