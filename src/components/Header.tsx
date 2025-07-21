import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo href="/" size="normal" firstName="Consultorio" lastName="Virtual" />
        {location.pathname === '/' ? (
          // Links da Landing Page
          <nav className={styles.nav}>
            <a href="#sobre">Sobre</a>
            <a href="#artigos">Artigos</a>
            <a href="#profissionais">Profissionais</a>
          </nav>
        ) : (
          // Link "Início" para outras páginas
          <nav className={styles.nav}>
            <a href="/">Início</a>
          </nav>
        )}
        <div className={styles.actions}>
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className={styles.dashboardButton}>Dashboard</button>
              <button onClick={handleSignOut} className={styles.authButton}>Sair</button>
            </>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className={styles.authButton}>Login</button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;