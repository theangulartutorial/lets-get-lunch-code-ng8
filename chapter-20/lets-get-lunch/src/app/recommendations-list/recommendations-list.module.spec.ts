import { RecommendationsListModule } from './recommendations-list.module';

describe('RecommendationsListModule', () => {
  let recommendationsListModule: RecommendationsListModule;

  beforeEach(() => {
    recommendationsListModule = new RecommendationsListModule();
  });

  it('should create an instance', () => {
    expect(recommendationsListModule).toBeTruthy();
  });
});
