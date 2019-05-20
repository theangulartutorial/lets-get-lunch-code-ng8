import { CommentCreateModule } from './comment-create.module';

describe('CommentCreateModule', () => {
  let commentCreateModule: CommentCreateModule;

  beforeEach(() => {
    commentCreateModule = new CommentCreateModule();
  });

  it('should create an instance', () => {
    expect(commentCreateModule).toBeTruthy();
  });
});
