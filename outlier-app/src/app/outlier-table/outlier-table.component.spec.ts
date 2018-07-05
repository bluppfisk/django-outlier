
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlierTableComponent } from './outlier-table.component';

describe('OutlierTableComponent', () => {
  let component: OutlierTableComponent;
  let fixture: ComponentFixture<OutlierTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlierTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
