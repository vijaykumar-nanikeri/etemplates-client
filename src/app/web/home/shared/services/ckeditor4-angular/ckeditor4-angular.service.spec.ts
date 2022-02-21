import { TestBed } from '@angular/core/testing';

import { Ckeditor4AngularService } from './ckeditor4-angular.service';

describe('Ckeditor4AngularService', () => {
  let service: Ckeditor4AngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ckeditor4AngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
