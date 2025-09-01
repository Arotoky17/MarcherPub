import { apiClient } from './api';

export type Candidature = {
  id: number;
  offerId: number;
  entrepriseId: number;
  status: 'en_attente' | 'acceptée' | 'rejetée';
  message?: string | null;
  fileUrl?: string | null;
};

export async function submitCandidature(params: {
  offerId: number;
  message?: string;
  file?: { uri: string; name: string; type: string } | null;
}): Promise<Candidature> {
  const formData = new FormData();
  formData.append('offerId', String(params.offerId));
  if (params.message) formData.append('message', params.message);
  if (params.file) {
    formData.append('file', params.file as any);
  }
  const { data } = await apiClient.post('/candidatures', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data?.candidature;
}

export async function getMyCandidatures(): Promise<Candidature[]> {
  const { data } = await apiClient.get('/candidatures/me');
  return data;
}


