import { EventsListModule } from './events-list.module';

describe('EventsListModule', () => {
  let eventsListModule: EventsListModule;

  beforeEach(() => {
    eventsListModule = new EventsListModule();
  });

  it('should create an instance', () => {
    expect(eventsListModule).toBeTruthy();
  });
});
