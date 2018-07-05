import { TestBed, inject } from '@angular/core/testing';

import { CharService } from './char.service';

describe('CharService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CharService]
    });
  });

  it('should be created', inject([CharService], (service: CharService) => {
    expect(service).toBeTruthy();
  }));
});
