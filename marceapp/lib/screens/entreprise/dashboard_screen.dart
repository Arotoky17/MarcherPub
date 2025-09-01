import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/offers_provider.dart';
import '../../providers/candidatures_provider.dart';
import '../../widgets/custom_button.dart';
import '../../utils/constants.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final offersProvider = Provider.of<OffersProvider>(context, listen: false);
    final candidaturesProvider = Provider.of<CandidaturesProvider>(context, listen: false);
    
    await Future.wait([
      offersProvider.loadOffers(),
      candidaturesProvider.loadMyCandidatures(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.dashboardTitle),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // En-tête avec informations de l'entreprise
              _buildCompanyHeader(),
              
              const SizedBox(height: AppSizes.lg),
              
              // Statistiques rapides
              _buildQuickStats(),
              
              const SizedBox(height: AppSizes.lg),
              
              // Actions rapides
              _buildQuickActions(),
              
              const SizedBox(height: AppSizes.lg),
              
              // Dernières offres
              _buildRecentOffers(),
              
              const SizedBox(height: AppSizes.lg),
              
              // Dernières candidatures
              _buildRecentCandidatures(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCompanyHeader() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final user = authProvider.user;
        return Container(
          padding: const EdgeInsets.all(AppSizes.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppSizes.radiusLg),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.3),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: const Icon(
                      Icons.business,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),
                  const SizedBox(width: AppSizes.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.companyName ?? 'Entreprise',
                          style: AppTextStyles.h3.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: AppSizes.xs),
                        Text(
                          'Bienvenue, ${user?.username ?? 'Utilisateur'}',
                          style: AppTextStyles.body2.copyWith(
                            color: Colors.white.withValues(alpha: 0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSizes.md),
              Text(
                'Gérez vos offres et candidatures en toute simplicité',
                style: AppTextStyles.body2.copyWith(
                  color: Colors.white.withValues(alpha: 0.8),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildQuickStats() {
    return Consumer2<OffersProvider, CandidaturesProvider>(
      builder: (context, offersProvider, candidaturesProvider, child) {
        final totalOffers = offersProvider.offers.length;
        final publishedOffers = offersProvider.getOffersByStatus('published').length;
        final pendingOffers = offersProvider.getOffersByStatus('pending').length;
        final totalCandidatures = candidaturesProvider.candidatures.length;
        final pendingCandidatures = candidaturesProvider.getCandidaturesByStatus('pending').length;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Statistiques',
              style: AppTextStyles.h3,
            ),
            const SizedBox(height: AppSizes.md),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Offres',
                    totalOffers.toString(),
                    Icons.work,
                    AppColors.primary,
                  ),
                ),
                const SizedBox(width: AppSizes.sm),
                Expanded(
                  child: _buildStatCard(
                    'Publiées',
                    publishedOffers.toString(),
                    Icons.published_with_changes,
                    AppColors.success,
                  ),
                ),
                const SizedBox(width: AppSizes.sm),
                Expanded(
                  child: _buildStatCard(
                    'En attente',
                    pendingOffers.toString(),
                    Icons.schedule,
                    AppColors.warning,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.sm),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Candidatures',
                    totalCandidatures.toString(),
                    Icons.description,
                    AppColors.secondary,
                  ),
                ),
                const SizedBox(width: AppSizes.sm),
                Expanded(
                  child: _buildStatCard(
                    'En cours',
                    pendingCandidatures.toString(),
                    Icons.pending,
                    AppColors.info,
                  ),
                ),
                const SizedBox(width: AppSizes.sm),
                Expanded(
                  child: Container(), // Placeholder pour aligner la grille
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: AppSizes.sm),
          Text(
            value,
            style: AppTextStyles.h3.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSizes.xs),
          Text(
            title,
            style: AppTextStyles.caption,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Actions rapides',
          style: AppTextStyles.h3,
        ),
        const SizedBox(height: AppSizes.md),
        Row(
          children: [
            Expanded(
              child: CustomButton(
                text: 'Nouvelle offre',
                icon: Icons.add,
                onPressed: () {
                  Navigator.pushNamed(context, '/offers/create');
                },
              ),
            ),
            const SizedBox(width: AppSizes.sm),
            Expanded(
              child: CustomButton(
                text: 'Voir les offres',
                icon: Icons.work,
                isSecondary: true,
                onPressed: () {
                  Navigator.pushNamed(context, '/offers');
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSizes.sm),
        Row(
          children: [
            Expanded(
              child: CustomButton(
                text: 'Mes candidatures',
                icon: Icons.description,
                isSecondary: true,
                onPressed: () {
                  Navigator.pushNamed(context, '/candidatures');
                },
              ),
            ),
            const SizedBox(width: AppSizes.sm),
            Expanded(
              child: CustomButton(
                text: 'Profil',
                icon: Icons.person,
                isSecondary: true,
                onPressed: () {
                  Navigator.pushNamed(context, '/profile');
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRecentOffers() {
    return Consumer<OffersProvider>(
      builder: (context, offersProvider, child) {
        final recentOffers = offersProvider.offers.take(3).toList();
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Dernières offres',
                  style: AppTextStyles.h3,
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/offers');
                  },
                  child: const Text('Voir tout'),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.md),
            if (recentOffers.isEmpty)
              _buildEmptyState(
                'Aucune offre',
                'Créez votre première offre pour commencer',
                Icons.work_outline,
              )
            else
              ...recentOffers.map((offer) => _buildOfferCard(offer)),
          ],
        );
      },
    );
  }

  Widget _buildRecentCandidatures() {
    return Consumer<CandidaturesProvider>(
      builder: (context, candidaturesProvider, child) {
        final recentCandidatures = candidaturesProvider.candidatures.take(3).toList();
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Dernières candidatures',
                  style: AppTextStyles.h3,
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/candidatures');
                  },
                  child: const Text('Voir tout'),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.md),
            if (recentCandidatures.isEmpty)
              _buildEmptyState(
                'Aucune candidature',
                'Postulez à des offres pour voir vos candidatures ici',
                Icons.description_outlined,
              )
            else
              ...recentCandidatures.map((candidature) => _buildCandidatureCard(candidature)),
          ],
        );
      },
    );
  }

  Widget _buildOfferCard(offer) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.sm),
      padding: const EdgeInsets.all(AppSizes.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                '${NumberFormat.currency(symbol: '').format(offer.budget)} FCFA',
                style: AppTextStyles.body2.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCandidatureCard(candidature) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.sm),
      padding: const EdgeInsets.all(AppSizes.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  candidature.offer?.title ?? 'Offre',
                  style: AppTextStyles.h4,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              _buildCandidatureStatusChip(candidature.status),
            ],
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            'Postulé le ${DateFormat('dd/MM/yyyy').format(candidature.createdAt)}',
            style: AppTextStyles.caption,
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    IconData icon;
    
    switch (status.toLowerCase()) {
      case 'published':
        color = AppColors.success;
        icon = Icons.published_with_changes;
        break;
      case 'pending':
        color = AppColors.warning;
        icon = Icons.schedule;
        break;
      case 'draft':
        color = AppColors.statusDraft;
        icon = Icons.drafts;
        break;
      case 'rejected':
        color = AppColors.error;
        icon = Icons.cancel;
        break;
      default:
        color = AppColors.textSecondary;
        icon = Icons.help;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.sm, vertical: AppSizes.xs),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radiusSm),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: AppSizes.xs),
          Text(
            status.toUpperCase(),
            style: AppTextStyles.caption.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCandidatureStatusChip(String status) {
    Color color;
    IconData icon;
    
    switch (status.toLowerCase()) {
      case 'accepted':
        color = AppColors.success;
        icon = Icons.check_circle;
        break;
      case 'rejected':
        color = AppColors.error;
        icon = Icons.cancel;
        break;
      case 'pending':
        color = AppColors.warning;
        icon = Icons.schedule;
        break;
      case 'under_review':
        color = AppColors.info;
        icon = Icons.visibility;
        break;
      default:
        color = AppColors.textSecondary;
        icon = Icons.help;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.sm, vertical: AppSizes.xs),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radiusSm),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: AppSizes.xs),
          Text(
            status.replaceAll('_', ' ').toUpperCase(),
            style: AppTextStyles.caption.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String title, String message, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.xl),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusMd),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            size: 48,
            color: AppColors.textSecondary,
          ),
          const SizedBox(height: AppSizes.md),
          Text(
            title,
            style: AppTextStyles.h4.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            message,
            style: AppTextStyles.body2.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
