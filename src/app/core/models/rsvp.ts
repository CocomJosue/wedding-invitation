export interface Rsvp {
  id?: number;
  guestId: string;
  attending: boolean;
  companions: string[];
  submittedAt?: string;
}
