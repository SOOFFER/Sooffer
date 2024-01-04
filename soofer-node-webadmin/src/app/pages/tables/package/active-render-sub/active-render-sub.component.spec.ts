import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRenderSubComponent } from './active-render-sub.component';

describe('ActiveRenderSubComponent', () => {
  let component: ActiveRenderSubComponent;
  let fixture: ComponentFixture<ActiveRenderSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveRenderSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveRenderSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
