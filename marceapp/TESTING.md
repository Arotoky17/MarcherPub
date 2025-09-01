# Guide de Test - MarchePub Flutter App

## Vue d'ensemble

Ce document décrit les procédures de test pour l'application MarchePub Flutter, incluant les tests unitaires, d'intégration et manuels.

## Prérequis

- Flutter SDK installé
- Backend MarchePub en cours d'exécution
- Émulateur Android/iOS ou appareil physique
- IDE (Android Studio, VS Code)

## Configuration de l'environnement de test

### 1. Configuration du backend
Assurez-vous que le backend est configuré et accessible :
```bash
# Dans le dossier Backend
npm install
npm start
```

Le backend doit être accessible sur `http://localhost:3001`

### 2. Configuration de l'application
Vérifiez que l'URL de l'API est correcte dans `lib/utils/config.dart` :
```dart
static const String apiBaseUrl = 'http://localhost:3001/api';
```

## Tests unitaires

### Structure des tests
Les tests unitaires sont organisés dans le dossier `test/` :
```
test/
├── unit/
│   ├── models/
│   ├── services/
│   ├── providers/
│   └── utils/
├── widget/
└── integration/
```

### Exécution des tests unitaires
```bash
# Tous les tests
flutter test

# Tests spécifiques
flutter test test/unit/models/user_test.dart

# Tests avec couverture
flutter test --coverage
```

### Exemples de tests

#### Test de modèle User
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:marceapp/models/user.dart';

void main() {
  group('User Model Tests', () {
    test('should create User from JSON', () {
      final json = {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com',
        'role': 'entreprise',
        'companyName': 'Test Company',
      };

      final user = User.fromJson(json);

      expect(user.id, 1);
      expect(user.username, 'testuser');
      expect(user.email, 'test@example.com');
      expect(user.role, 'entreprise');
      expect(user.companyName, 'Test Company');
    });

    test('should convert User to JSON', () {
      final user = User(
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'entreprise',
        companyName: 'Test Company',
      );

      final json = user.toJson();

      expect(json['id'], 1);
      expect(json['username'], 'testuser');
      expect(json['email'], 'test@example.com');
      expect(json['role'], 'entreprise');
      expect(json['companyName'], 'Test Company');
    });
  });
}
```

#### Test de service API
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:marceapp/services/api_service.dart';

void main() {
  group('ApiService Tests', () {
    late ApiService apiService;

    setUp(() {
      apiService = ApiService();
    });

    test('should initialize with empty token', () {
      expect(apiService.token, isNull);
    });

    test('should save and retrieve token', () async {
      const testToken = 'test_token_123';
      await apiService.saveToken(testToken);
      
      // Note: Dans un vrai test, vous devriez vérifier le stockage
      // Ici nous testons juste que la méthode ne lance pas d'exception
      expect(() async => await apiService.saveToken(testToken), returnsNormally);
    });
  });
}
```

#### Test de provider
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:marceapp/providers/auth_provider.dart';

void main() {
  group('AuthProvider Tests', () {
    late AuthProvider authProvider;

    setUp(() {
      authProvider = AuthProvider();
    });

    test('should initialize with default values', () {
      expect(authProvider.user, isNull);
      expect(authProvider.isLoading, false);
      expect(authProvider.error, isNull);
      expect(authProvider.isAuthenticated, false);
    });

    test('should set loading state', () {
      authProvider.setLoading(true);
      expect(authProvider.isLoading, true);
    });

    test('should set error state', () {
      const errorMessage = 'Test error';
      authProvider.setError(errorMessage);
      expect(authProvider.error, errorMessage);
    });
  });
}
```

## Tests de widgets

### Test d'écran de connexion
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:marceapp/screens/auth/login_screen.dart';
import 'package:marceapp/providers/auth_provider.dart';

void main() {
  group('LoginScreen Widget Tests', () {
    testWidgets('should display login form', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ChangeNotifierProvider(
            create: (_) => AuthProvider(),
            child: const LoginScreen(),
          ),
        ),
      );

      expect(find.text('MarchePub'), findsOneWidget);
      expect(find.text('Nom d\'utilisateur'), findsOneWidget);
      expect(find.text('Mot de passe'), findsOneWidget);
      expect(find.text('Se connecter'), findsOneWidget);
    });

    testWidgets('should validate form fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ChangeNotifierProvider(
            create: (_) => AuthProvider(),
            child: const LoginScreen(),
          ),
        ),
      );

      // Tenter de se connecter sans saisir de données
      await tester.tap(find.text('Se connecter'));
      await tester.pump();

      // Vérifier que les messages d'erreur apparaissent
      expect(find.text('Veuillez saisir votre nom d\'utilisateur'), findsOneWidget);
      expect(find.text('Veuillez saisir votre mot de passe'), findsOneWidget);
    });
  });
}
```

## Tests d'intégration

### Test de flux complet d'authentification
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:marceapp/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Authentication Flow Test', () {
    testWidgets('should complete login flow', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Vérifier que l'écran de connexion s'affiche
      expect(find.text('MarchePub'), findsOneWidget);

      // Saisir les identifiants
      await tester.enterText(
        find.byType(TextFormField).first,
        'testuser'
      );
      await tester.enterText(
        find.byType(TextFormField).last,
        'password123'
      );

      // Taper sur le bouton de connexion
      await tester.tap(find.text('Se connecter'));
      await tester.pumpAndSettle();

      // Vérifier la navigation vers le dashboard
      expect(find.text('Tableau de bord'), findsOneWidget);
    });
  });
}
```

## Tests manuels

### Checklist de test manuel

#### 1. Tests d'authentification
- [ ] **Inscription** : Créer un nouveau compte entreprise
- [ ] **Connexion** : Se connecter avec des identifiants valides
- [ ] **Déconnexion** : Se déconnecter et vérifier la redirection
- [ ] **Validation** : Tester les messages d'erreur de validation
- [ ] **Persistance** : Vérifier que la session persiste après redémarrage

#### 2. Tests du tableau de bord
- [ ] **Affichage** : Vérifier l'affichage des statistiques
- [ ] **Navigation** : Tester la navigation entre les onglets
- [ ] **Actualisation** : Tester le pull-to-refresh
- [ ] **Actions rapides** : Vérifier les boutons d'action

#### 3. Tests de gestion des offres
- [ ] **Création** : Créer une nouvelle offre
- [ ] **Validation** : Tester la validation des champs
- [ ] **Liste** : Afficher la liste des offres
- [ ] **Modification** : Modifier une offre existante
- [ ] **Suppression** : Supprimer une offre

#### 4. Tests de gestion des candidatures
- [ ] **Postulation** : Postuler à une offre
- [ ] **Suivi** : Vérifier le statut des candidatures
- [ ] **Historique** : Consulter l'historique des candidatures

#### 5. Tests de performance
- [ ] **Temps de chargement** : Vérifier les temps de réponse
- [ ] **Mémoire** : Surveiller l'utilisation de la mémoire
- [ ] **Batterie** : Tester l'impact sur la batterie

#### 6. Tests de compatibilité
- [ ] **Android** : Tester sur différentes versions Android
- [ ] **iOS** : Tester sur différentes versions iOS
- [ ] **Tailles d'écran** : Tester sur différentes résolutions
- [ ] **Orientation** : Tester en mode portrait et paysage

### Scénarios de test

#### Scénario 1 : Nouvel utilisateur
1. Ouvrir l'application
2. Taper sur "S'inscrire"
3. Remplir le formulaire d'inscription
4. Valider l'inscription
5. Vérifier la connexion automatique
6. Compléter le profil entreprise

#### Scénario 2 : Utilisateur existant
1. Ouvrir l'application
2. Se connecter avec des identifiants existants
3. Vérifier l'affichage du tableau de bord
4. Créer une nouvelle offre
5. Vérifier l'apparition dans la liste

#### Scénario 3 : Gestion des erreurs
1. Tenter de se connecter avec des identifiants incorrects
2. Vérifier l'affichage du message d'erreur
3. Tester la connexion sans réseau
4. Vérifier la gestion des erreurs réseau

## Tests de sécurité

### Tests d'authentification
- [ ] **Token JWT** : Vérifier la validité des tokens
- [ ] **Expiration** : Tester l'expiration des tokens
- [ ] **Stockage sécurisé** : Vérifier le stockage des tokens
- [ ] **Déconnexion** : Vérifier la suppression des tokens

### Tests de validation
- [ ] **Injection SQL** : Tester les champs de saisie
- [ ] **XSS** : Tester les champs de texte
- [ ] **Validation côté client** : Vérifier la validation des formulaires
- [ ] **Validation côté serveur** : Vérifier la validation API

## Tests de performance

### Métriques à surveiller
- **Temps de démarrage** : < 3 secondes
- **Temps de navigation** : < 1 seconde
- **Temps de chargement des données** : < 2 secondes
- **Utilisation mémoire** : < 100 MB
- **Taille APK** : < 50 MB

### Outils de test de performance
```bash
# Profiling de performance
flutter run --profile

# Analyse de la taille
flutter build apk --analyze-size

# Test de performance
flutter drive --target=test_driver/app.dart
```

## Tests d'accessibilité

### Checklist d'accessibilité
- [ ] **Contraste** : Vérifier le contraste des couleurs
- [ ] **Taille de texte** : Tester avec différentes tailles de police
- [ ] **Navigation clavier** : Tester la navigation au clavier
- [ ] **Lecteurs d'écran** : Tester avec les lecteurs d'écran
- [ ] **Labels** : Vérifier les labels des champs

## Tests de régression

### Tests automatisés
```bash
# Exécuter tous les tests avant chaque commit
flutter test

# Tests d'intégration avant déploiement
flutter test integration_test/

# Tests de performance
flutter drive --target=test_driver/performance.dart
```

### Tests manuels de régression
- [ ] **Fonctionnalités critiques** : Tester les fonctionnalités principales
- [ ] **Navigation** : Vérifier tous les chemins de navigation
- [ ] **Formulaires** : Tester tous les formulaires
- [ ] **Affichage** : Vérifier l'affichage sur différents appareils

## Rapport de bugs

### Template de rapport de bug
```
**Titre** : [BRIEF] Description courte du bug

**Description** : Description détaillée du problème

**Étapes pour reproduire** :
1. Étape 1
2. Étape 2
3. Étape 3

**Comportement attendu** : Ce qui devrait se passer

**Comportement observé** : Ce qui se passe réellement

**Environnement** :
- Appareil : [Android/iOS version]
- Version app : [version]
- Version backend : [version]

**Captures d'écran** : [si applicable]

**Logs** : [logs d'erreur si disponibles]
```

## Conclusion

Ce guide de test couvre les aspects essentiels du testing pour l'application MarchePub. Il est important de maintenir et mettre à jour ces tests au fur et à mesure de l'évolution de l'application.

Pour toute question concernant les tests, consultez la documentation Flutter officielle ou contactez l'équipe de développement.
