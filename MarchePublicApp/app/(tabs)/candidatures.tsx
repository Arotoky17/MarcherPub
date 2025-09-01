import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { apiGet } from '../../src/api/client';

type Candidature = {
  id: number;
  status: 'en_attente' | 'acceptée' | 'rejetée';
  createdAt: string;
  Offer?: { id: number; title: string };
};

export default function CandidaturesScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Candidature[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMy = async () => {
    setLoading(true);
    try {
      const res = await apiGet<Candidature[]>('/candidatures/me');
      setItems(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMy();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMy();
    setRefreshing(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => String(i.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.Offer?.title || 'Offre'}</Text>
          <Text style={{ marginTop: 4 }}>Statut: {item.status}</Text>
          <Text style={{ color: '#6b7280', marginTop: 4 }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Aucune candidature</Text>}
    />
  );
}


