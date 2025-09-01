import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class CandidaturesScreen extends StatelessWidget {
  const CandidaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Candidatures'),
      ),
      body: const Center(
        child: Text(
          'Écran des candidatures - À implémenter',
          style: AppTextStyles.h2,
        ),
      ),
    );
  }
}
