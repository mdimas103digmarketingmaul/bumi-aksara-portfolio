export interface PetaBencanaReport {
  id: string;
  reportId: string;
  source: 'PetaBencana';
  sourceType: 'community-report';
  disasterType: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  reportedAt: string;
  city?: string;
  regionCode?: string;
  verificationStatus?: string;
  simulated?: boolean;
}
