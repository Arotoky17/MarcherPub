import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiGet, apiPost } from '../../src/api/client';

type Offer = {
  id: number;
  title: string;
  description: string;
  domaine: string;
  status: string;
};

export default function OfferDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<{ offre: Offer }>(`/offres/${id}`);
        setOffer(res.offre);
      } catch (e: any) {
        Alert.alert('Erreur', e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const apply = async () => {
    setSubmitting(true);
    try {
      await apiPost('/candidatures', { offerId: Number(id), message: 'Je souhaite postuler via mobile' });
      Alert.alert('Succès', 'Candidature envoyée');
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;
  if (!offer) return <Text style={{ margin: 24 }}>Offre introuvable</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>{offer.title}</Text>
      <Text style={{ marginTop: 8 }}>{offer.description}</Text>
      <Text style={{ marginTop: 12, color: '#374151' }}>Domaine: {offer.domaine}</Text>

      <TouchableOpacity
        onPress={apply}
        disabled={submitting}
        style={{ marginTop: 20, backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>{submitting ? 'Envoi...' : 'Postuler'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


