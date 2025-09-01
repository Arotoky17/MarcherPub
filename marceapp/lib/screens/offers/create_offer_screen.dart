import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/offers_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../utils/constants.dart';
import '../../utils/validators.dart';

class CreateOfferScreen extends StatefulWidget {
  const CreateOfferScreen({super.key});

  @override
  State<CreateOfferScreen> createState() => _CreateOfferScreenState();
}

class _CreateOfferScreenState extends State<CreateOfferScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  final _budgetController = TextEditingController();
  final _requirementsController = TextEditingController();
  
  String _selectedCategory = '';
  DateTime? _deadline;
  bool _isLoading = false;

  final List<String> _categories = [
    'Développement Web',
    'Développement Mobile',
    'Design Graphique',
    'Marketing Digital',
    'Rédaction Web',
    'Traduction',
    'Montage Vidéo',
    'Photographie',
    'Consultation',
    'Autre'
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    _budgetController.dispose();
    _requirementsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Nouvelle Offre'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isLoading)
            TextButton(
              onPressed: _saveAsDraft,
              child: const Text(
                'Enregistrer',
                style: TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Informations de base
              _buildSectionTitle('Informations de base'),
              const SizedBox(height: AppSizes.sm),
              
              CustomTextField(
                controller: _titleController,
                labelText: 'Titre de l\'offre *',
                hintText: 'Ex: Développeur Flutter expérimenté',
                validator: (value) => Validators.required(value),
                maxLines: 1,
              ),
              const SizedBox(height: AppSizes.sm),
              
              CustomDropdownField<String>(
                value: _selectedCategory.isEmpty ? null : _selectedCategory,
                labelText: 'Catégorie *',
                hintText: 'Sélectionnez une catégorie',
                items: _categories,
                itemText: (category) => category,
                onChanged: (value) {
                  setState(() {
                    _selectedCategory = value!;
                  });
                },
                validator: (value) => Validators.required(value),
              ),
              const SizedBox(height: AppSizes.sm),
              
              CustomTextField(
                controller: _descriptionController,
                labelText: 'Description *',
                hintText: 'Décrivez en détail votre projet...',
                validator: (value) => Validators.required(value),
                maxLines: 5,
              ),
              const SizedBox(height: AppSizes.sm),
              
              // Localisation et budget
              _buildSectionTitle('Localisation et budget'),
              const SizedBox(height: AppSizes.sm),
              
              CustomTextField(
                controller: _locationController,
                labelText: 'Localisation *',
                hintText: 'Ex: Abidjan, Côte d\'Ivoire',
                validator: (value) => Validators.required(value),
                maxLines: 1,
              ),
              const SizedBox(height: AppSizes.sm),
              
              CustomTextField(
                controller: _budgetController,
                labelText: 'Budget (FCFA) *',
                hintText: 'Ex: 500000',
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (Validators.required(value) != null) {
                    return 'Le budget est requis';
                  }
                  if (Validators.isNumeric(value, 'Le budget doit être un nombre') != null) {
                    return 'Le budget doit être un nombre';
                  }
                  final budget = double.tryParse(value!);
                  if (budget == null || budget <= 0) {
                    return 'Le budget doit être supérieur à 0';
                  }
                  return null;
                },
                maxLines: 1,
              ),
              const SizedBox(height: AppSizes.sm),
              
              // Date limite
              _buildDeadlineSelector(),
              const SizedBox(height: AppSizes.sm),
              
              // Exigences
              _buildSectionTitle('Exigences et compétences'),
              const SizedBox(height: AppSizes.sm),
              
              CustomTextField(
                controller: _requirementsController,
                labelText: 'Exigences et compétences',
                hintText: 'Listez les compétences requises, expérience, etc.',
                maxLines: 4,
              ),
              const SizedBox(height: AppSizes.lg),
              
              // Boutons d'action
              Row(
                children: [
                  Expanded(
                    child: CustomButton(
                      text: 'Enregistrer comme brouillon',
                      isSecondary: true,
                      onPressed: _isLoading ? null : _saveAsDraft,
                    ),
                  ),
                  const SizedBox(width: AppSizes.sm),
                  Expanded(
                    child: CustomButton(
                      text: 'Publier l\'offre',
                      isLoading: _isLoading,
                      onPressed: _isLoading ? null : _publishOffer,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSizes.xl),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTextStyles.h4.copyWith(
        color: AppColors.primary,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildDeadlineSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Date limite *',
          style: AppTextStyles.body1.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: AppSizes.xs),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSizes.md,
            vertical: AppSizes.sm,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppSizes.radiusMd),
            border: Border.all(color: AppColors.divider),
          ),
          child: InkWell(
            onTap: _selectDeadline,
            child: Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  color: AppColors.textSecondary,
                  size: 20,
                ),
                const SizedBox(width: AppSizes.sm),
                Text(
                  _deadline != null
                      ? '${_deadline!.day}/${_deadline!.month}/${_deadline!.year}'
                      : 'Sélectionner une date',
                  style: AppTextStyles.body1.copyWith(
                    color: _deadline != null 
                        ? AppColors.textPrimary 
                        : AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_deadline == null)
          Padding(
            padding: const EdgeInsets.only(top: AppSizes.xs),
            child: Text(
              'La date limite est requise',
              style: AppTextStyles.caption.copyWith(
                color: AppColors.error,
              ),
            ),
          ),
      ],
    );
  }

  Future<void> _selectDeadline() async {
    final now = DateTime.now();
    final selectedDate = await showDatePicker(
      context: context,
      initialDate: now.add(const Duration(days: 7)),
      firstDate: now.add(const Duration(days: 1)),
      lastDate: now.add(const Duration(days: 365)),
      locale: const Locale('fr', 'FR'),
    );

    if (selectedDate != null) {
      setState(() {
        _deadline = selectedDate;
      });
    }
  }

  Future<void> _saveAsDraft() async {
    if (!_validateForm()) return;
    
    setState(() {
      _isLoading = true;
    });

    try {
      final offersProvider = Provider.of<OffersProvider>(context, listen: false);
      
      final offerData = {
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'category': _selectedCategory,
        'location': _locationController.text.trim(),
        'budget': double.parse(_budgetController.text.trim()),
        'deadline': _deadline!.toIso8601String(),
        'requirements': _requirementsController.text.trim(),
        'status': 'draft',
      };

      await offersProvider.createOffer(offerData);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offre enregistrée comme brouillon'),
            backgroundColor: AppColors.success,
          ),
        );
        context.go('/offers');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e.toString()}'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _publishOffer() async {
    if (!_validateForm()) return;
    
    setState(() {
      _isLoading = true;
    });

    try {
      final offersProvider = Provider.of<OffersProvider>(context, listen: false);
      
      final offerData = {
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'category': _selectedCategory,
        'location': _locationController.text.trim(),
        'budget': double.parse(_budgetController.text.trim()),
        'deadline': _deadline!.toIso8601String(),
        'requirements': _requirementsController.text.trim(),
        'status': 'pending',
      };

      await offersProvider.createOffer(offerData);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offre envoyée pour publication'),
            backgroundColor: AppColors.success,
          ),
        );
        context.go('/offers');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e.toString()}'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  bool _validateForm() {
    if (!_formKey.currentState!.validate()) {
      return false;
    }
    
    if (_deadline == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez sélectionner une date limite'),
          backgroundColor: AppColors.error,
        ),
      );
      return false;
    }
    
    return true;
  }
}
