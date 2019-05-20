import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationsListComponent } from './recommendations-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RecommendationsListComponent],
  exports: [RecommendationsListComponent]
})
export class RecommendationsListModule { }
