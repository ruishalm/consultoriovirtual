import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import type { Psychologist } from '../types';

const Dashboard: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const fetchPsychologists = async () => {
      if (role === 'manager') { // Carrega apenas se for gerente
        const querySnapshot = await getDocs(collection(db, 'psychologists'));
        const psychologistsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Psychologist[];
        setPsychologists(psychologistsList);
      }
    };

    fetchPsychologists();
  }, [role]); // Refetch se o role mudar

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      {user ? (
        <p>Olá, {user.email}! Você está logado como <strong>{role}</strong>.</p>
      ) : (
        <p>Redirecionando...</p>  
      )}
      {role === 'manager' && (  
        <>
          <h2>Psicólogos Registrados</h2>
          <ul className={styles.psychologistList}>
            {psychologists.map(psy => (
              <li key={psy.id} className={styles.psychologistItem}>
                <img 
                  src={psy.photoURL || `https://i.pravatar.cc/40?u=${psy.id}`} 
                  alt={psy.socialName} 
                  className={styles.itemPhoto} 
                />
                <span className={styles.itemName}>{psy.socialName} - CRP: {psy.crp}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className={styles.actions}>
        {role === 'manager' && (
          <button onClick={() => navigate('/manage-psychologists')} className={styles.manageButton}>Gerenciar Psicólogos</button>
        )}
        <button onClick={handleSignOut} className={styles.signOutButton}>Sair</button>
      </div>
    </div>
  );
};

export default Dashboard;