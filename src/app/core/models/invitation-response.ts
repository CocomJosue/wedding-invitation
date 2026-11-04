import { Guest } from "./guest";
import { Rsvp } from "./rsvp";

export interface InvitationResponse {
  guest: Guest;
  rsvp: Rsvp | null;
}
