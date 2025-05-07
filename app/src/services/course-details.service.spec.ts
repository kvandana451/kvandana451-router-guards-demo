import { TestBed } from '@angular/core/testing';

import { CourseDetailsService } from './course-details.service';

describe('CourseDetailsService', () => {
  let service: CourseDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
