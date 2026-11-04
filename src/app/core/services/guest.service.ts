import { inject, Injectable } from '@angular/core';
import { InvitationResponse } from '../models/invitation-response';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly supabaseService = inject(SupabaseService);

  async getInvitation(token: string): Promise<InvitationResponse> {
    const { data, error } =
      await this.supabaseService.supabase.functions.invoke<InvitationResponse>(
        'get-invitation',
        {
          body: { token }
        }
      );

    if (error) {
      throw new Error('No fue posible consultar la invitación.');
    }

    if (!data) {
      throw new Error('No se recibió información de la invitación.');
    }

    return data;
  }
}
