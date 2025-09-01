import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/offers_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../utils/constants.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  String _selectedStatus = 'all';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadOffers();
  }

  Future<void> _loadOffers() async {
    final offersProvider = Provider.of<OffersProvider>(context, listen: false);
    await offersProvider.loadOffers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Mes Offres'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadOffers,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filtres et recherche
          _buildFilters(),
          
          // Liste des offres
          Expanded(
            child: Consumer<OffersProvider>(
              builder: (context, offersProvider, child) {
                if (offersProvider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                final filteredOffers = _getFilteredOffers(offersProvider.offers);

                if (filteredOffers.isEmpty) {
                  return _buildEmptyState();
                }

                return RefreshIndicator(
                  onRefresh: _loadOffers,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(AppSizes.md),
                    itemCount: filteredOffers.length,
                    itemBuilder: (context, index) {
                      final offer = filteredOffers[index];
                      return _buildOfferCard(offer);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/offers/create'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.md),
      color: Colors.white,
      child: Column(
        children: [
          // Barre de recherche
          CustomSearchField(
            hintText: 'Rechercher une offre...',
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
          ),
          const SizedBox(height: AppSizes.sm),
          
          // Filtres par statut
          Row(
            children: [
              const Text('Statut: ', style: AppTextStyles.body1),
              const SizedBox(width: AppSizes.sm),
              Expanded(
                child: CustomDropdownField<String>(
                  value: _selectedStatus,
                  items: const ['all', 'draft', 'pending', 'published', 'rejected'],
                  itemText: (status) {
                    switch (status) {
                      case 'all': return 'Toutes';
                      case 'draft': return 'Brouillons';
                      case 'pending': return 'En attente';
                      case 'published': return 'Publiées';
                      case 'rejected': return 'Rejetées';
                      default: return status;
                    }
                  },
                  onChanged: (value) {
                    setState(() {
                      _selectedStatus = value!;
                    });
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOfferCard(dynamic offer) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(AppSizes.radiusMd),
          onTap: () => context.go('/offers/${offer.id}'),
          child: Padding(
            padding: const EdgeInsets.all(AppSizes.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        offer.title,
                        style: AppTextStyles.h4,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    _buildStatusChip(offer.status),
                  ],
                ),
                const SizedBox(height: AppSizes.sm),
                Text(
                  offer.description,
                  style: AppTextStyles.body2,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppSizes.sm),
                Row(
                  children: [
                    Icon(Icons.location_on, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: AppSizes.xs),
                    Text(
                      offer.location,
                      style: AppTextStyles.caption,
                    ),
                    const Spacer(),
                    Text(
                      '${offer.budget.toStringAsFixed(0)} FCFA',
                      style: AppTextStyles.body2.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSizes.sm),
                Row(
                  children: [
                    Icon(Icons.category, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: AppSizes.xs),
                    Text(
                      offer.category,
                      style: AppTextStyles.caption,
                    ),
                    const Spacer(),
                    Text(
                      '${offer.candidatures?.length ?? 0} candidatures',
                      style: AppTextStyles.caption,
                    ),
                  ],
                ),
                const SizedBox(height: AppSizes.sm),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                                         if (offer.status == 'draft')
                       CustomButton(
                         text: 'Modifier',
                         isSecondary: true,
                         onPressed: () => context.go('/offers/${offer.id}/edit'),
                       ),
                     if (offer.status == 'draft')
                       const SizedBox(width: AppSizes.sm),
                     if (offer.status == 'draft')
                       CustomButton(
                         text: 'Publier',
                         onPressed: () => _publishOffer(offer.id),
                       ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    IconData icon;
    String label;
    
    switch (status.toLowerCase()) {
      case 'published':
        color = AppColors.success;
        icon = Icons.published_with_changes;
        label = 'Publiée';
        break;
      case 'pending':
        color = AppColors.warning;
        icon = Icons.schedule;
        label = 'En attente';
        break;
      case 'draft':
        color = AppColors.statusDraft;
        icon = Icons.drafts;
        label = 'Brouillon';
        break;
      case 'rejected':
        color = AppColors.error;
        icon = Icons.cancel;
        label = 'Rejetée';
        break;
      default:
        color = AppColors.textSecondary;
        icon = Icons.help;
        label = status;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.sm, vertical: AppSizes.xs),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppSizes.radiusSm),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: AppSizes.xs),
          Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.work_outline,
            size: 64,
            color: AppColors.textSecondary,
          ),
          const SizedBox(height: AppSizes.md),
          Text(
            'Aucune offre trouvée',
            style: AppTextStyles.h3.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            'Créez votre première offre pour commencer',
            style: AppTextStyles.body2.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSizes.lg),
          CustomButton(
            text: 'Créer une offre',
            icon: Icons.add,
            onPressed: () => context.go('/offers/create'),
          ),
        ],
      ),
    );
  }

  List<dynamic> _getFilteredOffers(List<dynamic> offers) {
    return offers.where((offer) {
      // Filtre par statut
      if (_selectedStatus != 'all' && offer.status != _selectedStatus) {
        return false;
      }
      
      // Filtre par recherche
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        return offer.title.toLowerCase().contains(query) ||
               offer.description.toLowerCase().contains(query) ||
               offer.category.toLowerCase().contains(query) ||
               offer.location.toLowerCase().contains(query);
      }
      
      return true;
    }).toList();
  }

  Future<void> _publishOffer(int offerId) async {
    try {
      final offersProvider = Provider.of<OffersProvider>(context, listen: false);
      await offersProvider.updateOfferStatus(offerId, 'pending');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offre envoyée pour publication'),
            backgroundColor: AppColors.success,
          ),
        );
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
    }
  }
}
