export interface Ticket {
  id: string;
  type: 'standard' | 'premium';
  validFrom: Date;
  validTo: Date;
  parkingSpot?: string;
  qrCode: string;
}

export interface ParkingSpace {
  id: string;
  type: 'standard' | 'premium';
  isAvailable: boolean;
  location: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremiumMember: boolean;
  premiumValidUntil?: Date;
  tickets: Ticket[];
  notifications: Notification[];
}