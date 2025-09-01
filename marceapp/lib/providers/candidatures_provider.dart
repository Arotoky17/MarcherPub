import 'package:flutter/foundation.dart';
import '../models/candidature.dart';
import '../services/api_service.dart';

class CandidaturesProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Candidature> _candidatures = [];
  Candidature? _selectedCandidature;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Candidature> get candidatures => _candidatures;
  Candidature? get selectedCandidature => _selectedCandidature;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Charger les candidatures de l'utilisateur
  Future<void> loadMyCandidatures() async {
    _setLoading(true);
    _clearError();

    try {
      _candidatures = await _apiService.getMyCandidatures();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  // Créer une nouvelle candidature
  Future<bool> createCandidature(Map<String, dynamic> candidatureData) async {
    _setLoading(true);
    _clearError();

    try {
      final newCandidature = await _apiService.createCandidature(candidatureData);
      _candidatures.add(newCandidature);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Sélectionner une candidature
  void selectCandidature(Candidature candidature) {
    _selectedCandidature = candidature;
    notifyListeners();
  }

  // Vider la sélection
  void clearSelection() {
    _selectedCandidature = null;
    notifyListeners();
  }

  // Méthodes privées pour gérer l'état
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Filtrer les candidatures par statut
  List<Candidature> getCandidaturesByStatus(String status) {
    return _candidatures.where((candidature) => candidature.status == status).toList();
  }

  // Obtenir les statistiques des candidatures
  Map<String, int> getCandidatureStats() {
    final stats = <String, int>{};
    
    for (final candidature in _candidatures) {
      stats[candidature.status] = (stats[candidature.status] ?? 0) + 1;
    }
    
    return stats;
  }

  // Vérifier si l'utilisateur a déjà candidaté à une offre
  bool hasAppliedToOffer(int offerId) {
    return _candidatures.any((candidature) => candidature.offerId == offerId);
  }

  // Charger les candidatures pour une offre spécifique
  Future<void> loadCandidaturesForOffer(int offerId) async {
    _setLoading(true);
    _clearError();

    try {
      _candidatures = await _apiService.getCandidaturesForOffer(offerId);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  // Obtenir la candidature pour une offre spécifique
  Candidature? getCandidatureForOffer(int offerId) {
    try {
      return _candidatures.firstWhere((candidature) => candidature.offerId == offerId);
    } catch (e) {
      return null;
    }
  }
}
