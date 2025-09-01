import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/offer.dart';
import '../models/candidature.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3001/api';
  static const String authUrl = '$baseUrl/auth';
  static const String offersUrl = '$baseUrl/offres';
  static const String candidaturesUrl = '$baseUrl/candidatures';
  static const String dashboardUrl = '$baseUrl/dashboard';

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _token;

  // Getters pour les headers
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  // Initialiser le token depuis le stockage local
  Future<void> initializeToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
  }

  // Sauvegarder le token
  Future<void> saveToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  // Supprimer le token
  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  // Authentification
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$authUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        await saveToken(data['token']);
        return data;
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur de connexion');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  Future<Map<String, dynamic>> register({
    required String username,
    required String password,
    required String email,
    required String companyName,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$authUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'password': password,
          'email': email,
          'companyName': companyName,
        }),
      );

      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur d\'inscription');
      }
    } catch (e) {
      throw Exception('Erreur d\'inscription: $e');
    }
  }

  // Offres
  Future<List<Offer>> getOffers() async {
    try {
      final response = await http.get(
        Uri.parse(offersUrl),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Offer.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors de la récupération des offres');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération des offres: $e');
    }
  }

  Future<List<Offer>> getPublishedOffers() async {
    try {
      final response = await http.get(
        Uri.parse('$offersUrl/published'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Offer.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors de la récupération des offres publiées');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération des offres publiées: $e');
    }
  }

  Future<Offer> getOfferById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$offersUrl/$id'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Offer.fromJson(data);
      } else {
        throw Exception('Erreur lors de la récupération de l\'offre');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération de l\'offre: $e');
    }
  }

  Future<Offer> createOffer(Map<String, dynamic> offerData) async {
    try {
      final response = await http.post(
        Uri.parse(offersUrl),
        headers: _headers,
        body: json.encode(offerData),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Offer.fromJson(data);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur lors de la création de l\'offre');
      }
    } catch (e) {
      throw Exception('Erreur lors de la création de l\'offre: $e');
    }
  }

  Future<Offer> updateOffer(int id, Map<String, dynamic> offerData) async {
    try {
      final response = await http.put(
        Uri.parse('$offersUrl/$id'),
        headers: _headers,
        body: json.encode(offerData),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Offer.fromJson(data);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur lors de la mise à jour de l\'offre');
      }
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour de l\'offre: $e');
    }
  }

  Future<void> deleteOffer(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('$offersUrl/$id'),
        headers: _headers,
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur lors de la suppression de l\'offre');
      }
    } catch (e) {
      throw Exception('Erreur lors de la suppression de l\'offre: $e');
    }
  }

  // Candidatures
  Future<List<Candidature>> getMyCandidatures() async {
    try {
      final response = await http.get(
        Uri.parse('$candidaturesUrl/me'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Candidature.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors de la récupération des candidatures');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération des candidatures: $e');
    }
  }

  Future<Candidature> createCandidature(Map<String, dynamic> candidatureData) async {
    try {
      final response = await http.post(
        Uri.parse(candidaturesUrl),
        headers: _headers,
        body: json.encode(candidatureData),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Candidature.fromJson(data);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Erreur lors de la création de la candidature');
      }
    } catch (e) {
      throw Exception('Erreur lors de la création de la candidature: $e');
    }
  }

  Future<List<Candidature>> getCandidaturesForOffer(int offerId) async {
    try {
      final response = await http.get(
        Uri.parse('$candidaturesUrl/offer/$offerId'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Candidature.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors de la récupération des candidatures pour cette offre');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération des candidatures pour cette offre: $e');
    }
  }

  // Dashboard
  Future<Map<String, dynamic>> getDashboardData() async {
    try {
      final response = await http.get(
        Uri.parse(dashboardUrl),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Erreur lors de la récupération des données du dashboard');
      }
    } catch (e) {
      throw Exception('Erreur lors de la récupération des données du dashboard: $e');
    }
  }

  // Vérification du token
  Future<bool> verifyToken() async {
    try {
      final response = await http.get(
        Uri.parse('$authUrl/verify'),
        headers: _headers,
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
