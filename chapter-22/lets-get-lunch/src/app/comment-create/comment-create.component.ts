import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CommentsService } from '../services/comments/comments.service';
import { Comment } from '../services/comments/comment';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {
  @Input() eventId: string;
  comments: Array<Comment>;
  userComment: string;
  noComments: string;
  submitError: string;

  constructor(private commentsService: CommentsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.commentsService.getEventComments(this.eventId).subscribe(res => {
      if (res) {
        this.noComments = '';
        this.userComment = '';
        this.comments = res;
      } else {
        this.noComments = 'No comments exist for this event.';
      }
    });
  }

  addComment(comment: string) {
    const user = this.authService.currentUser();
    const payload: Comment = {
      _event: this.eventId,
      _creator: user._id,
      content: comment
    };
    this.commentsService.create(payload).subscribe(res => {
      this.submitError = '';
      this.fetchComments();
    }, err => {
      this.submitError = err.error.message;
    });
  }

}
