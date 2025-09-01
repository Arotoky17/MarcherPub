import 'package:flutter/material.dart';

class AppColors {
  // Couleurs principales
  static const Color primary = Color(0xFF1976D2);
  static const Color primaryDark = Color(0xFF1565C0);
  static const Color primaryLight = Color(0xFF42A5F5);
  
  // Couleurs secondaires
  static const Color secondary = Color(0xFF26A69A);
  static const Color secondaryDark = Color(0xFF00897B);
  static const Color secondaryLight = Color(0xFF4DB6AC);
  
  // Couleurs d'état
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);
  
  // Couleurs neutres
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textHint = Color(0xFFBDBDBD);
  static const Color divider = Color(0xFFE0E0E0);
  
  // Couleurs de statut des offres
  static const Color statusDraft = Color(0xFF9E9E9E);
  static const Color statusPending = Color(0xFFFF9800);
  static const Color statusPublished = Color(0xFF4CAF50);
  static const Color statusRejected = Color(0xFFF44336);
  static const Color statusClosed = Color(0xFF607D8B);
  
  // Couleurs de statut des candidatures
  static const Color candidaturePending = Color(0xFFFF9800);
  static const Color candidatureAccepted = Color(0xFF4CAF50);
  static const Color candidatureRejected = Color(0xFFF44336);
  static const Color candidatureUnderReview = Color(0xFF2196F3);
}

class AppTextStyles {
  // Titres
  static const TextStyle h1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle h2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle h3 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle h4 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins',
  );
  
  // Corps de texte
  static const TextStyle body1 = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle body2 = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    fontFamily: 'Poppins',
  );
  
  // Boutons
  static const TextStyle button = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
    fontFamily: 'Poppins',
  );
  
  static const TextStyle buttonSecondary = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.primary,
    fontFamily: 'Poppins',
  );
}

class AppSizes {
  // Espacements
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
  
  // Rayons de bordure
  static const double radiusSm = 4.0;
  static const double radiusMd = 8.0;
  static const double radiusLg = 12.0;
  static const double radiusXl = 16.0;
  
  // Hauteurs
  static const double buttonHeight = 48.0;
  static const double inputHeight = 56.0;
  static const double cardHeight = 120.0;
  
  // Largeurs
  static const double maxWidth = 400.0;
}

class AppStrings {
  // Titres d'écrans
  static const String appName = 'MarchePub';
  static const String loginTitle = 'Connexion';
  static const String registerTitle = 'Inscription';
  static const String dashboardTitle = 'Tableau de bord';
  static const String offersTitle = 'Offres';
  static const String candidaturesTitle = 'Candidatures';
  static const String profileTitle = 'Profil';
  
  // Messages
  static const String loginSuccess = 'Connexion réussie !';
  static const String registerSuccess = 'Inscription réussie !';
  static const String logoutSuccess = 'Déconnexion réussie';
  static const String errorOccurred = 'Une erreur est survenue';
  static const String noData = 'Aucune donnée disponible';
  
  // Validation
  static const String requiredField = 'Ce champ est obligatoire';
  static const String invalidEmail = 'Email invalide';
  static const String passwordTooShort = 'Le mot de passe doit contenir au moins 6 caractères';
  static const String passwordsDoNotMatch = 'Les mots de passe ne correspondent pas';
  
  // Statuts
  static const String statusDraft = 'Brouillon';
  static const String statusPending = 'En attente';
  static const String statusPublished = 'Publié';
  static const String statusRejected = 'Rejeté';
  static const String statusClosed = 'Fermé';
  
  // Catégories d'offres
  static const List<String> offerCategories = [
    'Construction',
    'Services',
    'Fournitures',
    'Travaux publics',
    'Informatique',
    'Transport',
    'Autres'
  ];
}

class AppIcons {
  // Icônes principales
  static const IconData home = Icons.home;
  static const IconData offers = Icons.work;
  static const IconData candidatures = Icons.description;
  static const IconData profile = Icons.person;
  static const IconData settings = Icons.settings;
  static const IconData logout = Icons.logout;
  
  // Icônes d'action
  static const IconData add = Icons.add;
  static const IconData edit = Icons.edit;
  static const IconData delete = Icons.delete;
  static const IconData search = Icons.search;
  static const IconData filter = Icons.filter_list;
  static const IconData sort = Icons.sort;
  
  // Icônes de statut
  static const IconData statusDraft = Icons.drafts;
  static const IconData statusPending = Icons.schedule;
  static const IconData statusPublished = Icons.published_with_changes;
  static const IconData statusRejected = Icons.cancel;
  static const IconData statusClosed = Icons.lock;
}
