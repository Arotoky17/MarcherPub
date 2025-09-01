import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function EntrepriseHomeScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>Espace Entreprise</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Tableau de bord</ThemedText>

      <View style={styles.cardsGrid}>
        <DashboardCard
          title="Offres publiées"
          value="12"
          subtitle="Total des offres actives"
          onPress={() => router.push('/entreprise/offres')}
        />
        <DashboardCard
          title="Candidatures"
          value="58"
          subtitle="En attente de traitement"
          onPress={() => router.push('/entreprise/mes-candidatures')}
        />
        <DashboardCard
          title="Créer une offre"
          value="+"
          subtitle="Publier une nouvelle offre"
          onPress={() => router.push('/entreprise/postuler')}
        />
      </View>

      <ThemedView style={[styles.section, { borderColor: palette.border }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Actions rapides</ThemedText>
        <View style={styles.actionsRow}>
          <PrimaryButton label="Voir les offres" onPress={() => router.push('/entreprise/offres')} />
          <PrimaryButton label="Mes candidatures" onPress={() => router.push('/entreprise/mes-candidatures')} />
        </View>
        <View style={styles.actionsRow}>
          <SecondaryButton label="Créer une offre" onPress={() => router.push('/entreprise/postuler')} />
          <SecondaryButton label="Statistiques" onPress={() => router.push('/(tabs)/explore')} />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function DashboardCard({ title, value, subtitle, onPress }: { title: string; value: string; subtitle: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText type="title" style={styles.cardValue}>{value}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <ThemedText style={styles.primaryButtonText}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <ThemedText style={styles.secondaryButtonText}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    marginTop: 8,
  },
  subtitle: {
    marginBottom: 8,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10,126,164,0.08)',
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardValue: {
    marginVertical: 6,
  },
  cardSubtitle: {
    opacity: 0.8,
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
});


