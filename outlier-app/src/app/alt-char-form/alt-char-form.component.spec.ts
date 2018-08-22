import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltCharFormComponent } from './alt-char-form.component';

describe('AltCharFormComponent', () => {
  let component: AltCharFormComponent;
  let fixture: ComponentFixture<AltCharFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltCharFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltCharFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
