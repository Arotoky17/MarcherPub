import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfilScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Profil</Text>
      <Text style={{ marginTop: 8 }}>Utilisateur: {user?.username}</Text>
      <Text>Rôle: {user?.role}</Text>
      {user?.companyName ? <Text>Société: {user.companyName}</Text> : null}

      <TouchableOpacity onPress={logout} style={{ marginTop: 20, backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}


