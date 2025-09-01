import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiPost } from '@/src/api/client';
import { useAuth } from '@/src/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', companyName: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await apiPost('/auth/register', formData);
      const { token, user } = res as any;
      await login({ token, user });
      Alert.alert('Succès', `Compte créé: ${user.username}`);
      router.replace('/entreprise');
    } catch (err: any) {
      Alert.alert('Erreur', err.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={(t) => setFormData((p) => ({ ...p, username: t }))}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(t) => setFormData((p) => ({ ...p, email: t }))}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Nom de l'entreprise"
        value={formData.companyName}
        onChangeText={(t) => setFormData((p) => ({ ...p, companyName: t }))}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Mot de passe"
        value={formData.password}
        onChangeText={(t) => setFormData((p) => ({ ...p, password: t }))}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#16a34a', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 8, color: '#2563eb', textAlign: 'center' },
});


