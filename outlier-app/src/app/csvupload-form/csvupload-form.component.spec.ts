import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSVUploadFormComponent } from './csvupload-form.component';

describe('CSVUploadFormComponent', () => {
  let component: CSVUploadFormComponent;
  let fixture: ComponentFixture<CSVUploadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSVUploadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSVUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
