import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberListComponent } from './member-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MemberListComponent],
  exports: [MemberListComponent]
})
export class MemberListModule { }
