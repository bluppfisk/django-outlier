import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSearchComponent } from './char-search.component';

describe('CharSearchComponent', () => {
  let component: CharSearchComponent;
  let fixture: ComponentFixture<CharSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
