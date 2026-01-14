export interface Politician {
  id: string;
  name: string;
  email: string;
  password?: string;
  position: string;
  photo: string;
  defaultLanguage: 'en' | 'hi' | 'mr';
}

export interface Karyakarta {
  id: string;
  name: string;
  whatsapp: string;
  dob: string; // YYYY-MM-DD format
  photo: string;
  createdAt: string;
}

export interface WhatsAppLog {
  id: string;
  recipientName: string;
  recipientNumber: string;
  message: string;
  bannerUrl?: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: string;
  language: 'en' | 'hi' | 'mr';
}

export interface BannerData {
  karyakartaName: string;
  karyakartaPhoto: string;
  politicianName: string;
  politicianPosition: string;
  politicianPhoto: string;
  language: 'en' | 'hi' | 'mr';
  translatedPoliticianName?: string;
  translatedKaryakartaName?: string;
}

export type TemplateId = 'modern-gradient' | 'political-branding' | 'minimal-premium' | 'festive';
