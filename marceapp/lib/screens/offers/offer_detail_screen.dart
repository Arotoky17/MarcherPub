import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/offers_provider.dart';
import '../../providers/candidatures_provider.dart';
import '../../widgets/custom_button.dart';
import '../../utils/constants.dart';

class OfferDetailScreen extends StatefulWidget {
  final int offerId;
  
  const OfferDetailScreen({super.key, required this.offerId});

  @override
  State<OfferDetailScreen> createState() => _OfferDetailScreenState();
}

class _OfferDetailScreenState extends State<OfferDetailScreen> {
  bool _isLoading = true;
  dynamic _offer;
  List<dynamic> _candidatures = [];

  @override
  void initState() {
    super.initState();
    _loadOfferDetails();
  }

  Future<void> _loadOfferDetails() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final offersProvider = Provider.of<OffersProvider>(context, listen: false);
      final candidaturesProvider = Provider.of<CandidaturesProvider>(context, listen: false);
      
      await Future.wait([
        offersProvider.loadOffer(widget.offerId),
        candidaturesProvider.loadCandidaturesForOffer(widget.offerId),
      ]);

      _offer = offersProvider.currentOffer;
      _candidatures = candidaturesProvider.candidatures;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Offre #${widget.offerId}'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadOfferDetails,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _offer == null
              ? _buildErrorState()
              : RefreshIndicator(
                  onRefresh: _loadOfferDetails,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(AppSizes.md),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // En-tête de l'offre
                        _buildOfferHeader(),
                        const SizedBox(height: AppSizes.lg),
                        
                        // Détails de l'offre
                        _buildOfferDetails(),
                        const SizedBox(height: AppSizes.lg),
                        
                        // Actions
                        _buildActions(),
                        const SizedBox(height: AppSizes.lg),
                        
                        // Candidatures
                        _buildCandidaturesSection(),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildOfferHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.lg),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  _offer.title,
                  style: AppTextStyles.h2,
                ),
              ),
              _buildStatusChip(_offer.status),
            ],
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            _offer.description,
            style: AppTextStyles.body1,
          ),
        ],
      ),
    );
  }

  Widget _buildOfferDetails() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.lg),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Détails de l\'offre',
            style: AppTextStyles.h3,
          ),
          const SizedBox(height: AppSizes.md),
          
          _buildDetailRow('Catégorie', _offer.category, Icons.category),
          _buildDetailRow('Localisation', _offer.location, Icons.location_on),
          _buildDetailRow('Budget', '${NumberFormat.currency(symbol: '').format(_offer.budget)} FCFA', Icons.attach_money),
          _buildDetailRow('Date limite', DateFormat('dd/MM/yyyy').format(DateTime.parse(_offer.deadline)), Icons.calendar_today),
          _buildDetailRow('Statut', _getStatusLabel(_offer.status), Icons.info),
          
          if (_offer.requirements?.isNotEmpty == true) ...[
            const SizedBox(height: AppSizes.md),
            Text(
              'Exigences et compétences',
              style: AppTextStyles.h4,
            ),
            const SizedBox(height: AppSizes.sm),
            Text(
              _offer.requirements,
              style: AppTextStyles.body2,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSizes.sm),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: AppSizes.sm),
          Text(
            '$label: ',
            style: AppTextStyles.body1.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.body1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActions() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.lg),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Actions',
            style: AppTextStyles.h3,
          ),
          const SizedBox(height: AppSizes.md),
          
          Row(
            children: [
              if (_offer.status == 'draft') ...[
                Expanded(
                  child: CustomButton(
                    text: 'Modifier',
                    icon: Icons.edit,
                    isSecondary: true,
                    onPressed: () => context.go('/offers/${widget.offerId}/edit'),
                  ),
                ),
                const SizedBox(width: AppSizes.sm),
                Expanded(
                  child: CustomButton(
                    text: 'Publier',
                    icon: Icons.publish,
                    onPressed: _publishOffer,
                  ),
                ),
              ] else if (_offer.status == 'published') ...[
                Expanded(
                  child: CustomButton(
                    text: 'Voir les candidatures',
                    icon: Icons.people,
                    onPressed: () => _scrollToCandidatures(),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCandidaturesSection() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.lg),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Candidatures (${_candidatures.length})',
                style: AppTextStyles.h3,
              ),
              if (_candidatures.isNotEmpty)
                TextButton(
                  onPressed: () => context.go('/offers/${widget.offerId}/candidatures'),
                  child: const Text('Voir tout'),
                ),
            ],
          ),
          const SizedBox(height: AppSizes.md),
          
          if (_candidatures.isEmpty)
            _buildEmptyCandidatures()
          else
            ..._candidatures.take(3).map((candidature) => _buildCandidatureCard(candidature)),
        ],
      ),
    );
  }

  Widget _buildCandidatureCard(dynamic candidature) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.sm),
      padding: const EdgeInsets.all(AppSizes.md),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(AppSizes.radiusSm),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.primary,
            child: Text(
              candidature.user?.username?.substring(0, 1).toUpperCase() ?? 'U',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: AppSizes.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  candidature.user?.username ?? 'Utilisateur',
                  style: AppTextStyles.body1.copyWith(fontWeight: FontWeight.w500),
                ),
                Text(
                  'Postulé le ${DateFormat('dd/MM/yyyy').format(candidature.createdAt)}',
                  style: AppTextStyles.caption,
                ),
              ],
            ),
          ),
          _buildCandidatureStatusChip(candidature.status),
        ],
      ),
    );
  }

  Widget _buildEmptyCandidatures() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.xl),
      child: Column(
        children: [
          Icon(
            Icons.people_outline,
            size: 48,
            color: AppColors.textSecondary,
          ),
          const SizedBox(height: AppSizes.md),
          Text(
            'Aucune candidature',
            style: AppTextStyles.h4.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            'Les candidatures apparaîtront ici une fois que votre offre sera publiée',
            style: AppTextStyles.body2.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    IconData icon;
    String label = _getStatusLabel(status);
    
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

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 64,
            color: AppColors.error,
          ),
          const SizedBox(height: AppSizes.md),
          Text(
            'Erreur lors du chargement',
            style: AppTextStyles.h3.copyWith(
              color: AppColors.error,
            ),
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            'Impossible de charger les détails de l\'offre',
            style: AppTextStyles.body2.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSizes.lg),
          CustomButton(
            text: 'Réessayer',
            icon: Icons.refresh,
            onPressed: _loadOfferDetails,
          ),
        ],
      ),
    );
  }

  String _getStatusLabel(String status) {
    switch (status.toLowerCase()) {
      case 'published':
        return 'Publiée';
      case 'pending':
        return 'En attente';
      case 'draft':
        return 'Brouillon';
      case 'rejected':
        return 'Rejetée';
      default:
        return status;
    }
  }

  Future<void> _publishOffer() async {
    try {
      final offersProvider = Provider.of<OffersProvider>(context, listen: false);
      await offersProvider.updateOfferStatus(widget.offerId, 'pending');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offre envoyée pour publication'),
            backgroundColor: AppColors.success,
          ),
        );
        _loadOfferDetails();
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

  void _scrollToCandidatures() {
    // Scroll vers la section candidatures
    // Implementation simple pour l'instant
  }
}
