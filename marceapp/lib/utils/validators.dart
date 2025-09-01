import 'config.dart';

class Validators {
  // Validation des champs requis
  static String? required(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return fieldName != null 
          ? '$fieldName est obligatoire'
          : AppConfig.validationErrors['required'];
    }
    return null;
  }

  // Validation des emails
  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return AppConfig.validationErrors['email'];
    }
    
    return null;
  }

  // Validation de la longueur minimale
  static String? minLength(String? value, int minLength, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return fieldName != null 
          ? '$fieldName est obligatoire'
          : AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length < minLength) {
      final error = AppConfig.validationErrors['min_length']!
          .replaceAll('{min}', minLength.toString());
      return fieldName != null 
          ? '$fieldName doit contenir au moins $minLength caractères'
          : error;
    }
    
    return null;
  }

  // Validation de la longueur maximale
  static String? maxLength(String? value, int maxLength, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return null; // Champ optionnel
    }
    
    if (value.trim().length > maxLength) {
      final error = AppConfig.validationErrors['max_length']!
          .replaceAll('{max}', maxLength.toString());
      return fieldName != null 
          ? '$fieldName ne peut pas dépasser $maxLength caractères'
          : error;
    }
    
    return null;
  }

  // Validation des mots de passe
  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.length < AppConfig.minPasswordLength) {
      return 'Le mot de passe doit contenir au moins ${AppConfig.minPasswordLength} caractères';
    }
    
    if (value.length > AppConfig.maxPasswordLength) {
      return 'Le mot de passe ne peut pas dépasser ${AppConfig.maxPasswordLength} caractères';
    }
    
    // Vérification de la complexité du mot de passe
    bool hasUpperCase = value.contains(RegExp(r'[A-Z]'));
    bool hasLowerCase = value.contains(RegExp(r'[a-z]'));
    bool hasDigits = value.contains(RegExp(r'[0-9]'));
    bool hasSpecialCharacters = value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    
    if (!hasUpperCase || !hasLowerCase || !hasDigits) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    
    return null;
  }

  // Validation de la confirmation du mot de passe
  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value != password) {
      return AppConfig.validationErrors['password_match'];
    }
    
    return null;
  }

  // Validation des noms d'utilisateur
  static String? username(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length < AppConfig.minUsernameLength) {
      return 'Le nom d\'utilisateur doit contenir au moins ${AppConfig.minUsernameLength} caractères';
    }
    
    if (value.trim().length > AppConfig.maxUsernameLength) {
      return 'Le nom d\'utilisateur ne peut pas dépasser ${AppConfig.maxUsernameLength} caractères';
    }
    
    // Vérification des caractères autorisés
    final usernameRegex = RegExp(r'^[a-zA-Z0-9_]+$');
    if (!usernameRegex.hasMatch(value)) {
      return 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
    }
    
    return null;
  }

  // Validation des noms d'entreprise
  static String? companyName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length > AppConfig.maxCompanyNameLength) {
      return 'Le nom de l\'entreprise ne peut pas dépasser ${AppConfig.maxCompanyNameLength} caractères';
    }
    
    return null;
  }

  // Validation des titres d'offres
  static String? offerTitle(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length > AppConfig.maxOfferTitleLength) {
      return 'Le titre ne peut pas dépasser ${AppConfig.maxOfferTitleLength} caractères';
    }
    
    return null;
  }

  // Validation des descriptions d'offres
  static String? offerDescription(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length > AppConfig.maxOfferDescriptionLength) {
      return 'La description ne peut pas dépasser ${AppConfig.maxOfferDescriptionLength} caractères';
    }
    
    return null;
  }

  // Validation des valeurs numériques
  static String? isNumeric(String? value, String errorMessage) {
    if (value == null || value.trim().isEmpty) {
      return errorMessage;
    }
    
    final number = double.tryParse(value.replaceAll(',', ''));
    if (number == null) {
      return errorMessage;
    }
    
    return null;
  }

  // Validation des budgets
  static String? budget(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    final budget = double.tryParse(value.replaceAll(',', ''));
    if (budget == null) {
      return 'Veuillez saisir un montant valide';
    }
    
    if (budget < AppConfig.minBudget) {
      return 'Le budget doit être supérieur à ${AppConfig.minBudget} FCFA';
    }
    
    if (budget > AppConfig.maxBudget) {
      return 'Le budget ne peut pas dépasser ${AppConfig.maxBudget} FCFA';
    }
    
    return null;
  }

  // Validation des localisations
  static String? location(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    if (value.trim().length < 2) {
      return 'La localisation doit contenir au moins 2 caractères';
    }
    
    return null;
  }

  // Validation des catégories
  static String? category(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    final validCategories = AppConfig.offerCategories.map((e) => e['value']).toList();
    if (!validCategories.contains(value)) {
      return 'Veuillez sélectionner une catégorie valide';
    }
    
    return null;
  }

  // Validation des dates
  static String? date(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    try {
      DateTime.parse(value);
    } catch (e) {
      return 'Veuillez saisir une date valide';
    }
    
    return null;
  }

  // Validation des dates futures
  static String? futureDate(String? value) {
    final dateValidation = date(value);
    if (dateValidation != null) {
      return dateValidation;
    }
    
    final selectedDate = DateTime.parse(value!);
    final now = DateTime.now();
    
    if (selectedDate.isBefore(now)) {
      return 'La date doit être dans le futur';
    }
    
    return null;
  }

  // Validation des numéros de téléphone
  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return null; // Champ optionnel
    }
    
    // Format pour les numéros ivoiriens
    final phoneRegex = RegExp(r'^(\+225|225)?[0-9]{8}$');
    if (!phoneRegex.hasMatch(value.replaceAll(' ', ''))) {
      return 'Veuillez saisir un numéro de téléphone valide';
    }
    
    return null;
  }

  // Validation des URLs
  static String? url(String? value) {
    if (value == null || value.trim().isEmpty) {
      return null; // Champ optionnel
    }
    
    try {
      Uri.parse(value);
    } catch (e) {
      return 'Veuillez saisir une URL valide';
    }
    
    return null;
  }

  // Validation des fichiers
  static String? fileSize(int? fileSize) {
    if (fileSize == null) {
      return AppConfig.validationErrors['required'];
    }
    
    if (fileSize > AppConfig.maxFileSize) {
      final maxSizeMB = AppConfig.maxFileSize ~/ (1024 * 1024);
      return AppConfig.validationErrors['file_too_large']!
          .replaceAll('{max}', maxSizeMB.toString());
    }
    
    return null;
  }

  // Validation des types de fichiers
  static String? fileType(String? fileName) {
    if (fileName == null || fileName.isEmpty) {
      return AppConfig.validationErrors['required'];
    }
    
    final extension = fileName.split('.').last.toLowerCase();
    if (!AppConfig.allowedFileTypes.contains(extension)) {
      return AppConfig.validationErrors['invalid_file_type'];
    }
    
    return null;
  }

  // Validation combinée pour les formulaires
  static String? validateField({
    required String? value,
    required String fieldType,
    Map<String, dynamic>? options,
  }) {
    switch (fieldType) {
      case 'required':
        return required(value, fieldName: options?['fieldName']);
      case 'email':
        return email(value);
      case 'password':
        return password(value);
      case 'username':
        return username(value);
      case 'companyName':
        return companyName(value);
      case 'offerTitle':
        return offerTitle(value);
      case 'offerDescription':
        return offerDescription(value);
      case 'budget':
        return budget(value);
      case 'location':
        return location(value);
      case 'category':
        return category(value);
      case 'date':
        return date(value);
      case 'futureDate':
        return futureDate(value);
      case 'phone':
        return phone(value);
      case 'url':
        return url(value);
      case 'minLength':
        return minLength(value, options?['minLength'] ?? 0, fieldName: options?['fieldName']);
      case 'maxLength':
        return maxLength(value, options?['maxLength'] ?? 0, fieldName: options?['fieldName']);
      default:
        return null;
    }
  }

  // Validation de formulaire complet
  static Map<String, String?> validateForm(Map<String, dynamic> formData, Map<String, List<String>> validationRules) {
    final errors = <String, String?>{};
    
    for (final field in validationRules.keys) {
      final value = formData[field];
      final rules = validationRules[field]!;
      
      for (final rule in rules) {
        final validation = validateField(
          value: value,
          fieldType: rule,
          options: {'fieldName': field},
        );
        
        if (validation != null) {
          errors[field] = validation;
          break; // Arrêter à la première erreur pour ce champ
        }
      }
    }
    
    return errors;
  }
}
