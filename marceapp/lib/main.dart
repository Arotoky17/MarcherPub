import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'providers/auth_provider.dart';
import 'providers/offers_provider.dart';
import 'providers/candidatures_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/entreprise/dashboard_screen.dart';
import 'screens/offers/offers_screen.dart';
import 'screens/offers/create_offer_screen.dart';
import 'screens/offers/offer_detail_screen.dart';
import 'screens/candidatures/candidatures_screen.dart';
import 'screens/candidatures/create_candidature_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'utils/constants.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => OffersProvider()),
        ChangeNotifierProvider(create: (_) => CandidaturesProvider()),
      ],
      child: MaterialApp.router(
        title: AppStrings.appName,
      theme: ThemeData(
          primarySwatch: Colors.blue,
          primaryColor: AppColors.primary,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            brightness: Brightness.light,
          ),
          fontFamily: 'Poppins',
          appBarTheme: const AppBarTheme(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
            centerTitle: true,
            titleTextStyle: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.white,
              fontFamily: 'Poppins',
            ),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              elevation: 2,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSizes.lg,
                vertical: AppSizes.md,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              ),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSizes.md,
              vertical: AppSizes.sm,
            ),
          ),
          cardTheme: CardThemeData(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSizes.radiusMd),
            ),
            color: Colors.white,
          ),
        ),
        routerConfig: _router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

// Configuration du routeur
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    // Route d'accueil - redirige vers login ou dashboard selon l'état d'authentification
    GoRoute(
      path: '/',
      builder: (context, state) => const AuthWrapper(),
    ),
    
    // Routes d'authentification
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    
    // Routes principales (protégées)
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
    
    // Routes des offres
    GoRoute(
      path: '/offers',
      builder: (context, state) => const OffersScreen(),
    ),
    GoRoute(
      path: '/offers/create',
      builder: (context, state) => const CreateOfferScreen(),
    ),
    GoRoute(
      path: '/offers/:id',
      builder: (context, state) {
        final offerId = int.parse(state.pathParameters['id']!);
        return OfferDetailScreen(offerId: offerId);
      },
    ),
    
    // Routes des candidatures
    GoRoute(
      path: '/candidatures',
      builder: (context, state) => const CandidaturesScreen(),
    ),
    GoRoute(
      path: '/candidatures/create/:offerId',
      builder: (context, state) {
        final offerId = int.parse(state.pathParameters['offerId']!);
        return CreateCandidatureScreen(offerId: offerId);
      },
    ),
    
    // Route du profil
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
);

// Widget wrapper pour gérer l'authentification
class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (authProvider.isAuthenticated) {
          return const MainLayout();
        }

        return const LoginScreen();
      },
    );
  }
}

// Layout principal avec navigation
class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const OffersScreen(),
    const CandidaturesScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textSecondary,
        backgroundColor: Colors.white,
        elevation: 8,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work),
            label: 'Offres',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description),
            label: 'Candidatures',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}

// Écrans temporaires pour les routes non encore implémentées
class OffersScreen extends StatelessWidget {
  const OffersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offres'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.pushNamed(context, '/offers/create');
            },
          ),
        ],
      ),
      body: const Center(
        child: Text('Écran des offres - À implémenter'),
      ),
    );
  }
}

class CreateOfferScreen extends StatelessWidget {
  const CreateOfferScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle offre'),
      ),
      body: const Center(
        child: Text('Créer une offre - À implémenter'),
      ),
    );
  }
}

class OfferDetailScreen extends StatelessWidget {
  final int offerId;

  const OfferDetailScreen({super.key, required this.offerId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Offre #$offerId'),
      ),
      body: Center(
        child: Text('Détails de l\'offre #$offerId - À implémenter'),
      ),
    );
  }
}

class CandidaturesScreen extends StatelessWidget {
  const CandidaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Candidatures'),
      ),
      body: const Center(
        child: Text('Écran des candidatures - À implémenter'),
      ),
    );
  }
}

class CreateCandidatureScreen extends StatelessWidget {
  final int offerId;

  const CreateCandidatureScreen({super.key, required this.offerId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle candidature'),
      ),
      body: Center(
        child: Text('Créer une candidature pour l\'offre #$offerId - À implémenter'),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = Provider.of<AuthProvider>(context, listen: false);
              await authProvider.logout();
              if (context.mounted) {
                context.go('/');
              }
            },
            ),
          ],
        ),
      body: const Center(
        child: Text('Écran du profil - À implémenter'),
      ),
    );
  }
}
