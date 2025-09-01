import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiPost } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await apiPost('/auth/login', formData);
      const { token, user } = res as any;
      await login({ token, user });
      Alert.alert('Succès', `Connecté en tant que ${user.role}`);
      router.replace('/entreprise');
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={(t) => setFormData((p) => ({ ...p, username: t }))}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        value={formData.password}
        onChangeText={(t) => setFormData((p) => ({ ...p, password: t }))}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/auth/register')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 8, color: '#2563eb', textAlign: 'center' },
});


