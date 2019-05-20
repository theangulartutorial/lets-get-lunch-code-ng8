import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RecommendationsService } from './recommendations.service';
const recommendationsResult = require('../../testing/recommendations-result.json');

describe('RecommendationsService', () => {
  let recommendationsService: RecommendationsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecommendationsService]
    });

    recommendationsService = TestBed.get(RecommendationsService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(recommendationsService).toBeTruthy();
  });

  describe('get', () => {
    it('should return a list of recommendations with a valid event id', () => {
      const eventId = '5a55135639fbc4ca3ee0ce5a';
      let response;

      recommendationsService.get(eventId).subscribe(res => {
        response = res;
      });

      http
        .expectOne('http://localhost:8080/api/recommendations/' + eventId)
        .flush(recommendationsResult);
      expect(response).toEqual(recommendationsResult);
      http.verify();
    });

    it('should return a 500 if an error occurs', () => {
      const eventId = '5a55135639fbc4ca3ee0ce5a';
      const error = 'Something went wrong!';
      let errorResponse;

      recommendationsService.get(eventId).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http
        .expectOne('http://localhost:8080/api/recommendations/' + eventId)
        .flush({message: error}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(error);
      http.verify();
    });
  });
});
