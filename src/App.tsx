import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ManagerRoute from './components/ManagerRoute';
import ManagePsychologists from './pages/ManagePsychologists';
import MeuConsultorio from './pages/MeuConsultorio';
import Sidebar from './components/Sidebar';

function App() {
  const { loading, user, role } = useAuth();

  // A sidebar é visível para psicólogos e pacientes, mas não para gerentes ou visitantes
  const isSidebarVisible = user && (role === 'psychologist' || role === 'patient');

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <div className="appWrapper">
        <Header />
        {isSidebarVisible && <Sidebar />}
        <main className={isSidebarVisible ? 'mainWithSidebar' : ''}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meu-consultorio" element={
              <ProtectedRoute>
                <MeuConsultorio />
              </ProtectedRoute>
            } />
            {/* As futuras rotas de agenda e pacientes virão aqui */}

            <Route path="/manage-psychologists" element={
              <ManagerRoute>
                <ManagePsychologists />
              </ManagerRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
