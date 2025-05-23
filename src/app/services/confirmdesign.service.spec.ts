import { TestBed } from '@angular/core/testing';

import { ConfirmdesignService } from './confirmdesign.service';

describe('ConfirmdesignService', () => {
  let service: ConfirmdesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmdesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
