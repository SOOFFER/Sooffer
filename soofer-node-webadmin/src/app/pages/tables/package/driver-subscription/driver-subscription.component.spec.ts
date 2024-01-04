import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSubscriptionComponent } from './driver-subscription.component';

describe('DriverSubscriptionComponent', () => {
  let component: DriverSubscriptionComponent;
  let fixture: ComponentFixture<DriverSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
