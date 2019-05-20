import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentCreateComponent } from './comment-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CommentCreateComponent],
  exports: [CommentCreateComponent]
})
export class CommentCreateModule { }
