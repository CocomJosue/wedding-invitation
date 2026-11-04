import { inject, Injectable } from '@angular/core';
import { SubmitRsvpRequest } from '../models/submit-rsvp-request';
import { SubmitRsvpResponse } from '../models/submit-rsvp-response';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private readonly supabaseService = inject(SupabaseService);

  async submit(
    request: SubmitRsvpRequest
  ): Promise<SubmitRsvpResponse> {
    const { data, error } =
      await this.supabaseService.supabase.functions.invoke<SubmitRsvpResponse>(
        'submit-rsvp',
        {
          body: request
        }
      );

    if (error) {
      throw new Error('No fue posible registrar tu respuesta.');
    }

    if (!data) {
      throw new Error('No se recibió confirmación del servidor.');
    }

    return data;
  }
}
