
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlierDashComponent } from './outlier-dash.component';

describe('OutlierDashComponent', () => {
  let component: OutlierDashComponent;
  let fixture: ComponentFixture<OutlierDashComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlierDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlierDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
