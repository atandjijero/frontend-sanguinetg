import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FonctionnementPage from './pages/FonctionnementPage';
import AProposPage from './pages/AProposPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import ReponseAlertePage from './pages/ReponseAlertePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { HeartbeatTracker } from './components/HeartbeatTracker';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import StaffDashboardLayout from './layouts/StaffDashboardLayout';
import DonneurDashboardLayout from './layouts/DonneurDashboardLayout';
import ProfilPage from './pages/dashboard/ProfilPage';
import StaffHomePage from './pages/dashboard/staff/StaffHomePage';
import AlertesPage from './pages/dashboard/staff/AlertesPage';
import AlerteDetailPage from './pages/dashboard/staff/AlerteDetailPage';
import DonneursPage from './pages/dashboard/staff/DonneursPage';
import CarnetsPage from './pages/dashboard/staff/CarnetsPage';
import RecompensesPage from './pages/dashboard/staff/RecompensesPage';
import ConseilsPage from './pages/dashboard/staff/ConseilsPage';
import QuartiersPage from './pages/dashboard/staff/QuartiersPage';
import CentresDonPage from './pages/dashboard/staff/CentresDonPage';
import EquipePage from './pages/dashboard/staff/EquipePage';
import MessagesPage from './pages/dashboard/staff/MessagesPage';
import SecurityPage from './pages/dashboard/staff/SecurityPage';
import DonneurHomePage from './pages/dashboard/donneur/DonneurHomePage';
import MesAlertesPage from './pages/dashboard/donneur/MesAlertesPage';
import CentresPage from './pages/dashboard/donneur/CentresPage';
import MonCarnetPage from './pages/dashboard/donneur/MonCarnetPage';
import MesRecompensesPage from './pages/dashboard/donneur/MesRecompensesPage';
import ConseilsSantePage from './pages/dashboard/donneur/ConseilsSantePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <HeartbeatTracker />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="fonctionnement" element={<FonctionnementPage />} />
              <Route path="a-propos" element={<AProposPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="reponse-alerte" element={<ReponseAlertePage />} />
              <Route path="connexion" element={<LoginPage />} />
              <Route path="inscription" element={<RegisterPage />} />
            </Route>

            {/* Espace CNTS : SUPERADMIN, ADMIN, AGENT_CNTS, MEDECIN (navigation masquée par rôle dans le sidebar) */}
            <Route element={<ProtectedRoute roles={['SUPERADMIN', 'ADMIN', 'AGENT_CNTS', 'MEDECIN']} />}>
              <Route path="admin" element={<StaffDashboardLayout />}>
                <Route index element={<StaffHomePage />} />
                <Route path="alertes" element={<AlertesPage />} />
                <Route path="alertes/:id" element={<AlerteDetailPage />} />
                <Route path="donneurs" element={<DonneursPage />} />
                <Route path="carnets" element={<CarnetsPage />} />
                <Route path="recompenses" element={<RecompensesPage />} />
                <Route path="conseils" element={<ConseilsPage />} />
                <Route path="quartiers" element={<QuartiersPage />} />
                <Route path="centres-don" element={<CentresDonPage />} />
                <Route path="equipe" element={<EquipePage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="profil" element={<ProfilPage />} />
                <Route element={<ProtectedRoute roles={['SUPERADMIN']} />}>
                  <Route path="securite" element={<SecurityPage />} />
                </Route>
              </Route>
            </Route>

            {/* Espace donneur : dashboard et sidebar distincts */}
            <Route element={<ProtectedRoute roles={['DONNEUR']} />}>
              <Route path="espace-donneur" element={<DonneurDashboardLayout />}>
                <Route index element={<DonneurHomePage />} />
                <Route path="alertes" element={<MesAlertesPage />} />
                <Route path="centres" element={<CentresPage />} />
                <Route path="carnet" element={<MonCarnetPage />} />
                <Route path="recompenses" element={<MesRecompensesPage />} />
                <Route path="conseils" element={<ConseilsSantePage />} />
                <Route path="profil" element={<ProfilPage />} />
              </Route>
            </Route>
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
