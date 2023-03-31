import { TestBed } from '@angular/core/testing';

import { WikidataWelshCastlesService } from './wikidata-welsh-castles.service';

describe('WikidataWelshCastlesService', () => {
  let service: WikidataWelshCastlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikidataWelshCastlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
