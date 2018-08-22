import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceBrowserComponent } from './source-browser.component';

describe('SourceBrowserComponent', () => {
  let component: SourceBrowserComponent;
  let fixture: ComponentFixture<SourceBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
