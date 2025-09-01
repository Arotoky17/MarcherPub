import 'offer.dart';
import 'user.dart';

class Candidature {
  final int id;
  final int offerId;
  final int userId;
  final String status;
  final String? coverLetter;
  final String? resume;
  final String? additionalDocuments;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Offer? offer;
  final User? user;

  Candidature({
    required this.id,
    required this.offerId,
    required this.userId,
    required this.status,
    this.coverLetter,
    this.resume,
    this.additionalDocuments,
    required this.createdAt,
    required this.updatedAt,
    this.offer,
    this.user,
  });

  factory Candidature.fromJson(Map<String, dynamic> json) {
    return Candidature(
      id: json['id'],
      offerId: json['offerId'],
      userId: json['userId'],
      status: json['status'],
      coverLetter: json['coverLetter'],
      resume: json['resume'],
      additionalDocuments: json['additionalDocuments'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      offer: json['offer'] != null ? Offer.fromJson(json['offer']) : null,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'offerId': offerId,
      'userId': userId,
      'status': status,
      'coverLetter': coverLetter,
      'resume': resume,
      'additionalDocuments': additionalDocuments,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'offer': offer?.toJson(),
      'user': user?.toJson(),
    };
  }

  Candidature copyWith({
    int? id,
    int? offerId,
    int? userId,
    String? status,
    String? coverLetter,
    String? resume,
    String? additionalDocuments,
    DateTime? createdAt,
    DateTime? updatedAt,
    Offer? offer,
    User? user,
  }) {
    return Candidature(
      id: id ?? this.id,
      offerId: offerId ?? this.offerId,
      userId: userId ?? this.userId,
      status: status ?? this.status,
      coverLetter: coverLetter ?? this.coverLetter,
      resume: resume ?? this.resume,
      additionalDocuments: additionalDocuments ?? this.additionalDocuments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      offer: offer ?? this.offer,
      user: user ?? this.user,
    );
  }
}
