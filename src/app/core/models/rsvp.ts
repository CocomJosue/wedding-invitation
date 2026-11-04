import { Companion } from "./companion";

export interface Rsvp {
  id: number;
  attending: boolean;
  submittedAt: string;
  companions: Companion[];
}
