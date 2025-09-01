class AppConfig {
  // Configuration de l'API
  static const String apiBaseUrl = 'http://localhost:3001/api';
  static const String apiVersion = 'v1';
  
  // Timeouts
  static const int connectionTimeout = 30000; // 30 secondes
  static const int receiveTimeout = 30000; // 30 secondes
  
  // Configuration de l'authentification
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const int tokenExpirationHours = 24;
  
  // Configuration de l'application
  static const String appName = 'MarchePub';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // Configuration des fichiers
  static const int maxFileSize = 10 * 1024 * 1024; // 10 MB
  static const List<String> allowedFileTypes = [
    'pdf',
    'doc',
    'docx',
    'jpg',
    'jpeg',
    'png'
  ];
  
  // Configuration des notifications
  static const bool enableNotifications = true;
  static const int notificationTimeout = 5000; // 5 secondes
  
  // Configuration du cache
  static const int cacheExpirationDays = 7;
  static const int maxCacheSize = 50 * 1024 * 1024; // 50 MB
  
  // URLs de support
  static const String supportEmail = 'support@marchepub.com';
  static const String documentationUrl = 'https://docs.marchepub.com';
  static const String privacyPolicyUrl = 'https://marchepub.com/privacy';
  static const String termsOfServiceUrl = 'https://marchepub.com/terms';
  
  // Configuration des erreurs
  static const String defaultErrorMessage = 'Une erreur est survenue. Veuillez réessayer.';
  static const String networkErrorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
  static const String serverErrorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
  
  // Configuration des validations
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 30;
  static const int maxCompanyNameLength = 100;
  static const int maxOfferTitleLength = 200;
  static const int maxOfferDescriptionLength = 2000;
  
  // Configuration des limites
  static const int maxOffersPerPage = 20;
  static const int maxCandidaturesPerPage = 20;
  static const double minBudget = 0.0;
  static const double maxBudget = 1000000000.0; // 1 milliard
  
  // Configuration des formats
  static const String dateFormat = 'dd/MM/yyyy';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';
  static const String currencyFormat = '#,##0.00';
  static const String currencySymbol = 'FCFA';
  
  // Configuration des couleurs (pour référence)
  static const Map<String, String> statusColors = {
    'draft': '#9E9E9E',
    'pending': '#FF9800',
    'published': '#4CAF50',
    'rejected': '#F44336',
    'closed': '#607D8B',
  };
  
  static const Map<String, String> candidatureStatusColors = {
    'pending': '#FF9800',
    'accepted': '#4CAF50',
    'rejected': '#F44336',
    'under_review': '#2196F3',
  };
  
  // Configuration des catégories d'offres
  static const List<Map<String, String>> offerCategories = [
    {'value': 'construction', 'label': 'Construction'},
    {'value': 'services', 'label': 'Services'},
    {'value': 'fournitures', 'label': 'Fournitures'},
    {'value': 'travaux_publics', 'label': 'Travaux publics'},
    {'value': 'informatique', 'label': 'Informatique'},
    {'value': 'transport', 'label': 'Transport'},
    {'value': 'autres', 'label': 'Autres'},
  ];
  
  // Configuration des localisations
  static const List<String> commonLocations = [
    'Abidjan',
    'Bouaké',
    'San-Pédro',
    'Yamoussoukro',
    'Korhogo',
    'Gagnoa',
    'Man',
    'Divo',
    'Daloa',
    'Anyama',
    'Abengourou',
    'Grand-Bassam',
    'Bingerville',
    'Agnibilékrou',
    'Bondoukou',
    'Odienné',
    'Séguéla',
    'Toumodi',
    'Dabou',
    'Adzopé',
  ];
  
  // Configuration des messages d'aide
  static const Map<String, String> helpMessages = {
    'offer_title': 'Titre clair et descriptif de votre offre',
    'offer_description': 'Description détaillée des travaux ou services',
    'offer_budget': 'Budget estimé en FCFA',
    'offer_location': 'Localisation des travaux ou services',
    'offer_category': 'Catégorie correspondant à votre offre',
    'offer_requirements': 'Exigences spécifiques pour les candidats',
    'candidature_cover_letter': 'Lettre de motivation expliquant votre intérêt',
    'candidature_resume': 'CV de votre entreprise',
  };
  
  // Configuration des erreurs de validation
  static const Map<String, String> validationErrors = {
    'required': 'Ce champ est obligatoire',
    'email': 'Veuillez saisir un email valide',
    'min_length': 'Ce champ doit contenir au moins {min} caractères',
    'max_length': 'Ce champ ne peut pas dépasser {max} caractères',
    'password_match': 'Les mots de passe ne correspondent pas',
    'invalid_format': 'Format invalide',
    'file_too_large': 'Le fichier est trop volumineux (max {max} MB)',
    'invalid_file_type': 'Type de fichier non autorisé',
    'budget_range': 'Le budget doit être entre {min} et {max} FCFA',
  };
}

// Classe pour la gestion des environnements
class Environment {
  static const String development = 'development';
  static const String staging = 'staging';
  static const String production = 'production';
  
  static String current = development;
  
  static bool get isDevelopment => current == development;
  static bool get isStaging => current == staging;
  static bool get isProduction => current == production;
  
  static String get apiUrl {
    switch (current) {
      case development:
        return 'http://localhost:3001/api';
      case staging:
        return 'https://staging-api.marchepub.com/api';
      case production:
        return 'https://api.marchepub.com/api';
      default:
        return 'http://localhost:3001/api';
    }
  }
  
  static bool get enableLogging {
    switch (current) {
      case development:
        return true;
      case staging:
        return true;
      case production:
        return false;
      default:
        return true;
    }
  }
  
  static bool get enableAnalytics {
    switch (current) {
      case development:
        return false;
      case staging:
        return true;
      case production:
        return true;
      default:
        return false;
    }
  }
}
