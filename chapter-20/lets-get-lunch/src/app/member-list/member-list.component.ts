import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  @Input() eventId: string;
  @Input() creatorId: string;
  @Input() members: Array<any>;
  isCreator: boolean;
  isMember: boolean;
  error: string;

  constructor(private authService: AuthService,
    private eventsService: EventsService) { }

  ngOnInit() {
    this.isCreator = this.eventsService.isEventCreator(this.creatorId);
    this.isMember = this.isUserInMemberList();
  }

  subscribe() {
    const user = this.authService.currentUser();
    const payload = { user: user._id };
    this.eventsService.subscribe(this.eventId, payload).subscribe(res => {
      this.members = res.members;
      this.isMember = this.isUserInMemberList();
    }, err => {
      this.error = err.error.message;
    });
  }

  isUserInMemberList(): boolean {
    const user = this.authService.currentUser();
    return this.members.some(member => member._id === user._id);
  }

}
