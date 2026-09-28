export type PassTier = 'visitor' | 'elite' | 'exhibitor';

export interface Attendee {
  id: string;
  ticketNumber: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  passType: PassTier;
  city: string;
  photoUrl?: string;
  amountPaid?: number;
  paymentStatus: 'PAID' | 'FREE' | 'PENDING' | 'FAILED';
  paymentRef?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
  referralCode?: string;
  notes?: string;
}

export interface TicketTier {
  id: PassTier;
  name: string;
  priceNgn: number;
  priceUsd: number;
  badgeTag: string;
  badgeColor: string;
  highlighted?: boolean;
  description: string;
  features: string[];
  accessAreas: string[];
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  photoUrl: string;
  category: 'Keynote' | 'PropTech' | 'Government' | 'Architecture' | 'Finance';
  sessions: string[];
  featured?: boolean;
}

export interface ScheduleItem {
  id: string;
  day: 1 | 2;
  time: string;
  title: string;
  description: string;
  location: string;
  track: 'Plenary' | 'PropTech' | 'Green Infrastructure' | 'Investment' | 'Masterclass';
  speakerIds: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  category: 'Titanium Headline' | 'Platinum Partner' | 'Gold Sponsor' | 'Silver Sponsor' | 'Media Partner';
  logoUrl: string;
  website: string;
  boothNumber?: string;
  description: string;
}

export interface ExhibitionBooth {
  id: string;
  name: string;
  hall: 'Hall A - Main Auditorium' | 'Hall B - Innovation Pavilion' | 'Outdoor Plaza';
  size: string;
  priceNgn: number;
  status: 'available' | 'reserved' | 'occupied';
  exhibitorName?: string;
  category?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Registration & Passes' | 'Exhibition & Booths' | 'Venue & Logistics';
}

export interface Marketer {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  commissionRate: number; // e.g. 15%
  totalClicks: number;
  conversionsCount: number;
  totalEarnedNgn: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface StaffBadge {
  id: string;
  exhibitorName: string;
  boothNumber: string;
  staffName: string;
  staffRole: string;
  email: string;
  phone: string;
  badgeCode: string;
  createdAt: string;
}

export interface SiteContent {
  eventTitle: string;
  eventEdition: string;
  eventDates: string;
  eventVenue: string;
  eventVenueAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  expectedAttendeesCount: string;
  exhibitingCompaniesCount: string;
  speakersCount: string;
  countriesCount: string;
  visitorPriceNgn: number;
  vipPriceNgn: number;
  exhibitorPriceNgn: number;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
}
