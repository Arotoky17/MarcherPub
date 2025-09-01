import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { fetchPublishedOffers, type Offer } from '@/src/lib/offers';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const fade = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPublishedOffers();
        setOffers(data.slice(0, 5));
      } catch (e) {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Animated.ScrollView style={{ opacity: fade }} contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>Plateforme des Marchés Publics</ThemedText>
      <ThemedText style={styles.subtitle}>Transparence, efficacité et accès simplifié aux opportunités.</ThemedText>

      <View style={styles.ctaRow}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: palette.tint }]} onPress={() => router.push('/login')}>
          <ThemedText style={styles.primaryText}>Se connecter</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryButton, { borderColor: palette.tint }]} onPress={() => router.push('/auth/register')}>
          <ThemedText style={[styles.secondaryText, { color: palette.tint }]}>Créer un compte</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={[styles.section, { borderColor: palette.border }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Dernières offres publiées</ThemedText>
        <FlatList
          data={offers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.offerItem} onPress={() => router.push(`/offre/${item.id}`)}>
              <ThemedText style={styles.offerTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.offerDesc} numberOfLines={2}>{item.description || '—'}</ThemedText>
            </TouchableOpacity>
          )}
          ListEmptyComponent={!loading ? <ThemedText>Aucune offre disponible</ThemedText> : null}
        />
      </ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { marginTop: 8 },
  subtitle: { opacity: 0.9 },
  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  primaryButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  primaryText: { color: 'white', fontWeight: '700' },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1 },
  secondaryText: { fontWeight: '700' },
  section: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 10, marginTop: 12 },
  sectionTitle: { marginBottom: 4 },
  offerItem: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  offerTitle: { fontWeight: '600', marginBottom: 2 },
  offerDesc: { opacity: 0.85 },
});


