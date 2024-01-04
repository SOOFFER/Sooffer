import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonNotifyComponent } from './button-notify.component';

describe('ButtonNotifyComponent', () => {
  let component: ButtonNotifyComponent;
  let fixture: ComponentFixture<ButtonNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
