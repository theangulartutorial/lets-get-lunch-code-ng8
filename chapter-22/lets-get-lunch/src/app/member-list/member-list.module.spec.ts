import { MemberListModule } from './member-list.module';

describe('MemberListModule', () => {
  let memberListModule: MemberListModule;

  beforeEach(() => {
    memberListModule = new MemberListModule();
  });

  it('should create an instance', () => {
    expect(memberListModule).toBeTruthy();
  });
});
