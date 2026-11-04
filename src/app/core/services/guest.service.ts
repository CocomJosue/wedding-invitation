import { Injectable } from '@angular/core';
import { Guest } from '../models/guest';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly guests: Guest[] = [
    {
      id: '1',
      token: 'a8f92k',
      name: 'Josué Cervantes',
      maxCompanions: 2
    },
    {
      id: '2',
      token: 'b7d31x',
      name: 'Invitado de prueba',
      maxCompanions: 1
    },
    {
      id: '3',
      token: 'c9e52m',
      name: 'Invitado sin acompañantes',
      maxCompanions: 0
    }
  ];

  getByToken(token: string): Observable<Guest> {
    const guest = this.guests.find(x => x.token === token);

    if (!guest) {
      return throwError(() => new Error('Invitación no encontrada'));
    }

    return of(guest);
  }
}
