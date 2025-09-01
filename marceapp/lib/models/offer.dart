class Offer {
  final int id;
  final String title;
  final String description;
  final String category;
  final String status;
  final DateTime deadline;
  final double budget;
  final String location;
  final String? requirements;
  final String? documents;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int? userId;

  Offer({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.status,
    required this.deadline,
    required this.budget,
    required this.location,
    this.requirements,
    this.documents,
    required this.createdAt,
    required this.updatedAt,
    this.userId,
  });

  factory Offer.fromJson(Map<String, dynamic> json) {
    return Offer(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      status: json['status'],
      deadline: DateTime.parse(json['deadline']),
      budget: json['budget']?.toDouble() ?? 0.0,
      location: json['location'],
      requirements: json['requirements'],
      documents: json['documents'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      userId: json['userId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'status': status,
      'deadline': deadline.toIso8601String(),
      'budget': budget,
      'location': location,
      'requirements': requirements,
      'documents': documents,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'userId': userId,
    };
  }

  Offer copyWith({
    int? id,
    String? title,
    String? description,
    String? category,
    String? status,
    DateTime? deadline,
    double? budget,
    String? location,
    String? requirements,
    String? documents,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? userId,
  }) {
    return Offer(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      status: status ?? this.status,
      deadline: deadline ?? this.deadline,
      budget: budget ?? this.budget,
      location: location ?? this.location,
      requirements: requirements ?? this.requirements,
      documents: documents ?? this.documents,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
    );
  }
}
