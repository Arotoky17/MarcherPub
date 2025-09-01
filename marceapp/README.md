# MarchePub - Application Flutter pour Marchés Publics

## Description

MarchePub est une application mobile Flutter conçue pour les entreprises souhaitant participer aux marchés publics. L'application permet aux entreprises de gérer leurs offres, candidatures et de suivre leurs activités dans le domaine des marchés publics.

## Fonctionnalités

### 🔐 Authentification
- **Connexion** : Interface de connexion sécurisée pour les entreprises
- **Inscription** : Création de compte entreprise avec validation
- **Gestion des sessions** : Stockage sécurisé des tokens d'authentification

### 📊 Tableau de bord
- **Vue d'ensemble** : Statistiques des offres et candidatures
- **Actions rapides** : Accès direct aux fonctionnalités principales
- **Dernières activités** : Aperçu des offres et candidatures récentes

### 💼 Gestion des offres
- **Création d'offres** : Interface pour créer de nouvelles offres
- **Liste des offres** : Affichage de toutes les offres de l'entreprise
- **Statuts** : Suivi des statuts (Brouillon, En attente, Publié, Rejeté)
- **Modification/Suppression** : Gestion complète des offres

### 📝 Gestion des candidatures
- **Postulation** : Candidature aux offres publiées
- **Suivi** : Statut des candidatures (En attente, Acceptée, Rejetée)
- **Historique** : Consultation des candidatures passées

### 👤 Profil utilisateur
- **Informations entreprise** : Gestion des données de l'entreprise
- **Paramètres** : Configuration de l'application
- **Déconnexion** : Fermeture sécurisée de session

## Architecture technique

### Structure du projet
```
lib/
├── models/           # Modèles de données
│   ├── user.dart
│   ├── offer.dart
│   └── candidature.dart
├── services/         # Services API
│   └── api_service.dart
├── providers/        # Gestion d'état (Provider)
│   ├── auth_provider.dart
│   ├── offers_provider.dart
│   └── candidatures_provider.dart
├── screens/          # Écrans de l'application
│   ├── auth/         # Écrans d'authentification
│   └── entreprise/   # Écrans entreprise
├── widgets/          # Widgets réutilisables
│   ├── custom_button.dart
│   └── custom_text_field.dart
├── utils/            # Utilitaires et constantes
│   └── constants.dart
└── main.dart         # Point d'entrée de l'application
```

### Technologies utilisées
- **Flutter** : Framework de développement mobile
- **Provider** : Gestion d'état
- **Go Router** : Navigation et routage
- **HTTP/Dio** : Communication avec l'API
- **Shared Preferences** : Stockage local
- **Intl** : Internationalisation

### Connexion au backend
L'application se connecte au backend Node.js via l'API REST :
- **URL de base** : `http://localhost:3001/api`
- **Authentification** : JWT (JSON Web Tokens)
- **Endpoints principaux** :
  - `/auth/login` - Connexion
  - `/auth/register` - Inscription
  - `/offres` - Gestion des offres
  - `/candidatures` - Gestion des candidatures
  - `/dashboard` - Données du tableau de bord

## Installation et configuration

### Prérequis
- Flutter SDK (version 3.9.0 ou supérieure)
- Dart SDK
- Android Studio / VS Code
- Backend MarchePub en cours d'exécution

### Installation
1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd marceapp
   ```

2. **Installer les dépendances**
   ```bash
   flutter pub get
   ```

3. **Configurer le backend**
   - Assurez-vous que le backend est en cours d'exécution sur `http://localhost:3001`
   - Vérifiez que l'API est accessible

4. **Lancer l'application**
   ```bash
   flutter run
   ```

### Configuration du backend
Assurez-vous que le backend est configuré avec :
- Base de données configurée
- Variables d'environnement définies
- CORS configuré pour l'application mobile

## Utilisation

### Première utilisation
1. **Inscription** : Créez un compte entreprise
2. **Connexion** : Connectez-vous avec vos identifiants
3. **Configuration** : Complétez les informations de votre entreprise

### Gestion des offres
1. **Créer une offre** : Utilisez le bouton "Nouvelle offre"
2. **Remplir les informations** : Titre, description, budget, localisation
3. **Soumettre** : L'offre sera envoyée pour validation
4. **Suivre le statut** : Consultez l'évolution de votre offre

### Candidatures
1. **Parcourir les offres** : Consultez les offres publiées
2. **Postuler** : Soumettez votre candidature
3. **Suivre** : Consultez le statut de vos candidatures

## Développement

### Ajout de nouvelles fonctionnalités
1. **Créer le modèle** dans `lib/models/`
2. **Ajouter le service** dans `lib/services/`
3. **Créer le provider** dans `lib/providers/`
4. **Développer l'écran** dans `lib/screens/`
5. **Ajouter la route** dans `main.dart`

### Tests
```bash
# Tests unitaires
flutter test

# Tests d'intégration
flutter test integration_test/
```

### Build
```bash
# Android APK
flutter build apk

# Android App Bundle
flutter build appbundle

# iOS
flutter build ios
```

## Sécurité

### Authentification
- Tokens JWT avec expiration
- Stockage sécurisé des tokens
- Validation automatique des sessions

### Données
- Validation côté client et serveur
- Chiffrement des mots de passe
- Protection contre les injections

## Support et maintenance

### Logs
L'application génère des logs pour le débogage :
- Erreurs d'authentification
- Échecs de communication API
- Actions utilisateur importantes

### Mise à jour
- Vérifiez régulièrement les mises à jour Flutter
- Maintenez les dépendances à jour
- Testez après chaque mise à jour

## Contribution

### Guidelines
1. Suivez les conventions de nommage Flutter
2. Documentez le code
3. Testez vos modifications
4. Utilisez des commits descriptifs

### Structure des commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: tests
chore: maintenance
```

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou support :
- Email : support@marchepub.com
- Documentation : [docs.marchepub.com](https://docs.marchepub.com)
- Issues : [GitHub Issues](https://github.com/marchepub/issues)

---

**MarchePub** - Simplifiez votre participation aux marchés publics
