import { Injectable } from '@angular/core';
import { Rsvp } from '../models/rsvp';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private responses: Rsvp[] = [];

  save(response: Rsvp): Observable<Rsvp> {
    const existingIndex = this.responses.findIndex(
      x => x.guestId === response.guestId
    );

    if (existingIndex >= 0) {
      this.responses[existingIndex] = response;
    } else {
      this.responses.push(response);
    }

    return of(response);
  }

  getByGuestId(guestId: string): Observable<Rsvp | null> {
    const response = this.responses.find(
      x => x.guestId === guestId
    ) ?? null;

    return of(response);
  }
}
