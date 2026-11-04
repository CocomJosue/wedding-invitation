import { Routes } from '@angular/router';
import { RsvpComponent } from './pages/rsvp/rsvp.component';

export const routes: Routes = [
  { path: 'i/:token', component: RsvpComponent },
  { path: '**', redirectTo: 'i/demo123' }
];
