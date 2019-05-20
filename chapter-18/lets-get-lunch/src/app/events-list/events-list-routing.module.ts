import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsListComponent } from './events-list.component';
import { AuthGuard } from '../guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: EventsListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsListRoutingModule { }
