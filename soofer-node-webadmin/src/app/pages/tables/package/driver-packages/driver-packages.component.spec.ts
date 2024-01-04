import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPackagesComponent } from './driver-packages.component';

describe('DriverPackagesComponent', () => {
  let component: DriverPackagesComponent;
  let fixture: ComponentFixture<DriverPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
