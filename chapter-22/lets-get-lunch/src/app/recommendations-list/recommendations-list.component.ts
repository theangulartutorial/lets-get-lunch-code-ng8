import { Component, OnInit, Input } from '@angular/core';
import {
  RecommendationsService
} from '../services/recommendations/recommendations.service';

@Component({
  selector: 'app-recommendations-list',
  templateUrl: './recommendations-list.component.html',
  styleUrls: ['./recommendations-list.component.css']
})
export class RecommendationsListComponent implements OnInit {
  @Input() eventId: string;
  @Input() suggestLocations: boolean;
  recommendations: Array<any>;
  error: string;

  constructor(private recommendationsService: RecommendationsService) { }

  ngOnInit() {
    if (this.suggestLocations) { this.getRecommendations(); }
  }

  getRecommendations() {
    this.recommendationsService.get(this.eventId).subscribe(res => {
      if (res) {
        this.recommendations = res.restaurants;
      } else {
        this.error = 'No recommendations for this location exist.';
      }
    }, err => {
      this.error = err.error.message;
    });
  }

}
