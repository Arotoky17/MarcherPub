import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { apiGet } from '../../src/api/client';

type Offer = {
  id: number;
  title: string;
  description: string;
  domaine: string;
  status: string;
  createdAt: string;
};

export default function OffresScreen() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await apiGet<{ offres: Offer[] }>('/offres/published');
      setOffers(res.offres || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
          onPress={() => router.push({ pathname: '/offre/[id]', params: { id: item.id } })}
        >
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
          <Text numberOfLines={2} style={{ color: '#6b7280', marginTop: 4 }}>{item.description}</Text>
          <Text style={{ marginTop: 6, color: '#374151' }}>Domaine: {item.domaine}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Aucune offre disponible</Text>}
    />
  );
}


