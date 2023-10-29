import { TestBed } from '@angular/core/testing';

import { PickJobsService } from './pick-jobs.service';

describe('PickJobsService', () => {
  let service: PickJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
