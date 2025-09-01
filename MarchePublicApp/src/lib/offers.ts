import { apiGet } from '@/src/api/client';

export type Offer = {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
};

export async function fetchPublishedOffers(): Promise<Offer[]> {
  return apiGet<Offer[]>('/offres/published');
}

export async function fetchDashboardStats(): Promise<{ totalOffres: number; totalCandidatures: number }> {
  return apiGet('/dashboard');
}


