import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { submitCandidature } from '../../src/lib/candidatures';
import * as DocumentPicker from 'expo-document-picker';

export default function PostulerScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string }>();
  const router = useRouter();
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<{ uri: string; name: string; type: string } | null>(null);

  const offerId = Number(params.id);

  const onSubmit = async () => {
    try {
      if (!offerId) {
        Alert.alert('Erreur', "Offre invalide");
        return;
      }
      setLoading(true);
      await submitCandidature({ offerId, message, file });
      Alert.alert('Succès', 'Candidature envoyée');
      router.replace('/entreprise/mes-candidatures');
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.error || 'Envoi échoué');
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;
    setFile({ uri: asset.uri, name: asset.name || 'document.pdf', type: 'application/pdf' });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{params.title || 'Postuler'}</Text>
      <Text style={{ marginTop: 12 }}>Message de motivation (optionnel)</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        placeholder="Votre message..."
        style={{ borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 120, marginTop: 8 }}
      />
      <View style={{ height: 12 }} />
      <Button title={file ? `Fichier sélectionné: ${file.name}` : 'Joindre un PDF'} onPress={pickDocument} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Envoi...' : 'Envoyer la candidature'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}


