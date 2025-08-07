import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = ({ token, role, redirectTo, ...userData }) => {
    console.log('🔐 AuthContext: Début de la connexion avec role:', role);
    console.log('📋 AuthContext: Données reçues:', { token: token ? 'présent' : 'absent', role, redirectTo, userData });
    
    try {
      // Sauvegarder les données
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, ...userData }));
      
      // Mettre à jour l'état
      const newUser = { token, role, ...userData };
      setUser(newUser);
      setIsAuthenticated(true);

      console.log('✅ AuthContext: Données sauvegardées');
      console.log('👤 AuthContext: Nouvel utilisateur:', newUser);
      console.log('🔍 AuthContext: localStorage user:', localStorage.getItem('user'));
      console.log('🔍 AuthContext: localStorage token:', localStorage.getItem('token') ? 'présent' : 'absent');

      // Utiliser le redirectTo du backend ou fallback sur la logique existante
      setTimeout(() => {
        const targetRoute = redirectTo || (() => {
          if (['ministere', 'admin', 'ministerepublique'].includes(role)) {
            return '/ministere/home';
          } else if (role === 'entreprise') {
            return '/entreprise/home';
          } else {
            return '/';
          }
        })();
        
        console.log('➡️ Redirection vers:', targetRoute);
        navigate(targetRoute, { replace: true });
      }, 200);

    } catch (error) {
      console.error('❌ Erreur dans AuthContext login:', error);
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion en cours...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};