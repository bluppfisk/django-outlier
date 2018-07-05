
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlierNavComponent } from './outlier-nav.component';

describe('OutlierNavComponent', () => {
  let component: OutlierNavComponent;
  let fixture: ComponentFixture<OutlierNavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlierNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlierNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
