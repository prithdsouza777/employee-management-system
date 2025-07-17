import { TestBed } from '@angular/core/testing';

import { UiComponents } from './ui-components';

describe('UiComponents', () => {
  let service: UiComponents;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiComponents);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
