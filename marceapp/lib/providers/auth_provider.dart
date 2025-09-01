import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _isAuthenticated = false;

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _isAuthenticated;

  // Initialiser l'état d'authentification
  Future<void> initialize() async {
    await _apiService.initializeToken();
    final isValid = await _apiService.verifyToken();
    _isAuthenticated = isValid;
    notifyListeners();
  }

  // Connexion
  Future<bool> login(String username, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.login(username, password);
      
      _user = User.fromJson(response['user']);
      _isAuthenticated = true;
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Inscription
  Future<bool> register({
    required String username,
    required String password,
    required String email,
    required String companyName,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.register(
        username: username,
        password: password,
        email: email,
        companyName: companyName,
      );
      
      // Après inscription réussie, on peut automatiquement connecter l'utilisateur
      return await login(username, password);
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Déconnexion
  Future<void> logout() async {
    await _apiService.clearToken();
    _user = null;
    _isAuthenticated = false;
    _clearError();
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

  // Mettre à jour les informations utilisateur
  void updateUser(User user) {
    _user = user;
    notifyListeners();
  }
}
