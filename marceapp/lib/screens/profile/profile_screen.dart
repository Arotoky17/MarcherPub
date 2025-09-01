import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
      ),
      body: const Center(
        child: Text(
          'Écran du profil - À implémenter',
          style: AppTextStyles.h2,
        ),
      ),
    );
  }
}
