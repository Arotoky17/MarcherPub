import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class CreateCandidatureScreen extends StatelessWidget {
  final int offerId;
  
  const CreateCandidatureScreen({super.key, required this.offerId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Postuler à l\'offre #$offerId'),
      ),
      body: Center(
        child: Text(
          'Créer une candidature pour l\'offre #$offerId - À implémenter',
          style: AppTextStyles.h2,
        ),
      ),
    );
  }
}
