import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getOfferById } from '../../src/lib/offers';

export default function OffreDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [offer, setOffer] = React.useState<any>(null);

  const offerId = Number(params.id);

  const load = React.useCallback(async () => {
    if (!offerId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getOfferById(offerId);
      setOffer(data);
    } catch (e) {
      setError('Impossible de charger cette offre');
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (!offerId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Offre invalide</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading ? <Text>Chargement...</Text> : null}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {offer ? (
        <>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{offer.title}</Text>
          {offer.domaine ? <Text style={{ marginTop: 6 }}>Domaine: {offer.domaine}</Text> : null}
          {offer.status ? <Text>Statut: {offer.status}</Text> : null}
          {offer.description ? <Text style={{ marginTop: 12 }}>{offer.description}</Text> : null}
          <View style={{ height: 16 }} />
          <Button title="Postuler" onPress={() => router.push({ pathname: '/entreprise/postuler', params: { id: String(offerId), title: offer.title } })} />
        </>
      ) : null}
    </View>
  );
}


