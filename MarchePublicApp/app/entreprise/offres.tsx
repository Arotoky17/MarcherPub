import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getPublishedOffers, Offer } from '../../src/lib/offers';

export default function EntrepriseOffres() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublishedOffers();
      setOffers(data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les offres');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = offers.filter(o => o.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher une offre..."
        style={{ borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/entreprise/offre-details', params: { id: String(item.id) } })}
            style={{ padding: 16, borderWidth: 1, borderRadius: 10, marginBottom: 12 }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
            {item.description ? <Text numberOfLines={2} style={{ marginTop: 6 }}>{item.description}</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text>Aucune offre disponible.</Text>
          </View>
        ) : null}
      />
    </View>
  );
}


