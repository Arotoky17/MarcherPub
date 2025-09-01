import 'package:flutter/foundation.dart';
import '../models/offer.dart';
import '../services/api_service.dart';

class OffersProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Offer> _offers = [];
  List<Offer> _publishedOffers = [];
  Offer? _selectedOffer;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Offer> get offers => _offers;
  List<Offer> get publishedOffers => _publishedOffers;
  Offer? get selectedOffer => _selectedOffer;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Charger toutes les offres
  Future<void> loadOffers() async {
    _setLoading(true);
    _clearError();

    try {
      _offers = await _apiService.getOffers();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  // Charger les offres publiées
  Future<void> loadPublishedOffers() async {
    _setLoading(true);
    _clearError();

    try {
      _publishedOffers = await _apiService.getPublishedOffers();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  // Charger une offre spécifique
  Future<void> loadOfferById(int id) async {
    _setLoading(true);
    _clearError();

    try {
      _selectedOffer = await _apiService.getOfferById(id);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  // Charger une offre spécifique (alias pour loadOfferById)
  Future<void> loadOffer(int id) async {
    await loadOfferById(id);
  }

  // Getter pour l'offre actuelle
  Offer? get currentOffer => _selectedOffer;

  // Créer une nouvelle offre
  Future<bool> createOffer(Map<String, dynamic> offerData) async {
    _setLoading(true);
    _clearError();

    try {
      final newOffer = await _apiService.createOffer(offerData);
      _offers.add(newOffer);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Mettre à jour une offre
  Future<bool> updateOffer(int id, Map<String, dynamic> offerData) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedOffer = await _apiService.updateOffer(id, offerData);
      
      // Mettre à jour dans la liste des offres
      final index = _offers.indexWhere((offer) => offer.id == id);
      if (index != -1) {
        _offers[index] = updatedOffer;
      }
      
      // Mettre à jour l'offre sélectionnée si c'est la même
      if (_selectedOffer?.id == id) {
        _selectedOffer = updatedOffer;
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Mettre à jour le statut d'une offre
  Future<bool> updateOfferStatus(int id, String status) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedOffer = await _apiService.updateOffer(id, {'status': status});
      
      // Mettre à jour dans la liste des offres
      final index = _offers.indexWhere((offer) => offer.id == id);
      if (index != -1) {
        _offers[index] = updatedOffer;
      }
      
      // Mettre à jour l'offre sélectionnée si c'est la même
      if (_selectedOffer?.id == id) {
        _selectedOffer = updatedOffer;
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Supprimer une offre
  Future<bool> deleteOffer(int id) async {
    _setLoading(true);
    _clearError();

    try {
      await _apiService.deleteOffer(id);
      
      // Supprimer de la liste des offres
      _offers.removeWhere((offer) => offer.id == id);
      
      // Vider l'offre sélectionnée si c'est la même
      if (_selectedOffer?.id == id) {
        _selectedOffer = null;
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Sélectionner une offre
  void selectOffer(Offer offer) {
    _selectedOffer = offer;
    notifyListeners();
  }

  // Vider la sélection
  void clearSelection() {
    _selectedOffer = null;
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

  // Filtrer les offres par statut
  List<Offer> getOffersByStatus(String status) {
    return _offers.where((offer) => offer.status == status).toList();
  }

  // Filtrer les offres par catégorie
  List<Offer> getOffersByCategory(String category) {
    return _offers.where((offer) => offer.category == category).toList();
  }
}
