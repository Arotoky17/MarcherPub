import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Accueil from './Pages/Home/Accueil';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import MesCandidatures from './Pages/Offre/MesCandidatures';
import PostulerOffre from './Pages/Entreprise/Postuler';
import OffreDetails from './Pages/Offre/OffreDetails';
import CreerOffreNouveau from './Pages/Ministere/CreerOffreNouveau';
import OffreEntreprise from './Pages/Offre/OffresEntreprise';
import OffresDisponibles from './Pages/Offre/OffresDisponibles';
import GestionCandidaturesToutes from './Pages/Ministere/GestionCandidaturesToutes';
import DashboardAdmin from './Pages/Dashboard/DashboardAdmin';
import DashboardEntreprise from './Pages/Dashboard/DashboardEntreprise';
import DashboardMinistere from './Pages/Dashboard/DashboardMinistere';
import EntrepriseHome from './Pages/Entreprise/EntrepriseHome';
import Home from './Pages/Ministere/Home';
import Navbar from './Components/Navbar';
import CreerOffre from './Pages/Ministere/CreerOffre';
import GestionCandidatures from './Pages/Ministere/GestionCandidatures';
import GestionOffres from './Pages/Ministere/GestionOffres';
import PrivateRoute from './Components/PrivateRoute';

function AppRoutes() {
  const location = useLocation();
 const showNavbar = location.pathname === '/';
  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offre/:id" element={<OffreDetails />} />

        {/* Routes ministère */}
        <Route path="/ministere/home" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <Home />
          </PrivateRoute> 
        } />
        <Route path="/ministere/GestionCandidatures" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <GestionCandidatures />
          </PrivateRoute>
        } />
        <Route path="/ministere/creer-offre-nouveau" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <CreerOffreNouveau />
          </PrivateRoute>
        } />
        <Route path="/ministere/gestion-offres" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <GestionOffres />
          </PrivateRoute>
        } />
        <Route path="/ministere/gestion-candidatures-toutes" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <GestionCandidaturesToutes />
          </PrivateRoute>
        } />
        <Route path="/dashboard/dashboardministere" element={
          <PrivateRoute roles={['ministere','admin','ministerepublique']}>
            <DashboardMinistere />
          </PrivateRoute>
        } />

        {/* Routes entreprise */}
        <Route path="/entreprise/home" element={
          <PrivateRoute roles={['entreprise']}>
            <EntrepriseHome />
          </PrivateRoute>
        } />
        <Route path="/entreprise/offres-disponibles" element={
          <PrivateRoute roles={['entreprise']}>
            <OffresDisponibles />
          </PrivateRoute>
        } />
        <Route path="/dashboard/dashboardentreprise" element={
          <PrivateRoute roles={['entreprise']}>
            <DashboardEntreprise />
          </PrivateRoute>
        } />
        <Route path="/entreprise/mescandidatures" element={
          <PrivateRoute roles={['entreprise']}>
            <MesCandidatures />
          </PrivateRoute>
        } />
        <Route path="/entreprise/postuler/:offerId" element={
          <PrivateRoute roles={['entreprise']}>
            <PostulerOffre />
          </PrivateRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;