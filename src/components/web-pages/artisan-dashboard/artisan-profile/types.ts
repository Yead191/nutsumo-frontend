export type AvailabilityStatus = "Available" | "Booked" | "Unavailable";

export type IdentityStatus =
  | "not_submitted"
  | "pending"
  | "verified"
  | "needs_update";

export interface ProfileFormState {
  name: string;
  email: string;
  image: string;
  businessName: string;
  trade: string;
  location: string;
  phone: string;
  experienceYears: number;
  bio: string;
  availabilityStatus: AvailabilityStatus;
  identityStatus: IdentityStatus;
}

export interface ProfessionalProfileManagerProps {
  user?: any;
}
