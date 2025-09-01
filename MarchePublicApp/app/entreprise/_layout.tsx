import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export default function EntrepriseLayout() {
  const { token, isLoading } = useAuth();
  const PREVIEW_MODE = true; // Set to false to re-enable auth guard

  if (isLoading) return null;
  if (!token && !PREVIEW_MODE) return <Redirect href="/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="offres" />
      <Stack.Screen name="mes-candidatures" />
      <Stack.Screen name="postuler" />
      <Stack.Screen name="offre-details" />
    </Stack>
  );
}


