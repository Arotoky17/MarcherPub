import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // ou mettre ton API

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      const { token, user } = response.data;
      await login({ token, role: user.role, ...user });
      Alert.alert('Succès', `Connecté en tant que ${user.role}`);
      // navigation.navigate selon le rôle
      if (user.role === 'ministere') navigation.navigate('MinistereHome');
      else if (user.role === 'entreprise') navigation.navigate('EntrepriseHome');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#1a202c' : '#fff' }]}>
      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Icon name={darkMode ? 'sun' : 'moon'} size={24} color={darkMode ? '#f6e05e' : '#1a202c'} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: darkMode ? '#38bdf8' : '#0284c7' }]}>Connexion</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={text => handleChange('username', text)}
        style={[styles.input, { backgroundColor: darkMode ? '#2d3748' : '#f0f0f0', color: darkMode ? '#fff' : '#000' }]}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mot de passe"
          value={formData.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1, backgroundColor: darkMode ? '#2d3748' : '#f0f0f0', color: darkMode ? '#fff' : '#000' }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 8 }}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, { backgroundColor: '#0284c7' }]}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ color: darkMode ? '#38bdf8' : '#0284c7', marginTop: 12 }}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 20 },
  input: { width: '100%', padding: 12, borderRadius: 10, marginBottom: 12 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
  button: { padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  themeButton: { position: 'absolute', top: 40, right: 20 },
});

export default Login;
