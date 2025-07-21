import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { AuthContextType, AuthUser, UserRole } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as AuthUser);

        // 1. Tenta verificar se é gerente.
        const managerDocRef = doc(db, 'managers', firebaseUser.uid);
        const managerDoc = await getDoc(managerDocRef).catch(() => null); // Trata o erro de permissão se não for gerente
        if (managerDoc?.exists()) {
          setRole('manager');
        } else {
          // 2. Se não for gerente, verifica se é psicólogo.
          const psychologistDocRef = doc(db, 'psychologists', firebaseUser.uid);
          const psychologistDoc = await getDoc(psychologistDocRef).catch(() => null);
          if (psychologistDoc?.exists()) {
            setRole('psychologist');
          } else {
            // 3. Se não for nenhum dos dois, é paciente.
            setRole('patient');
          }
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Garante que o loading termine após todas as verificações.
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
    // O useEffect cuidará de atualizar user e role
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
    // O useEffect cuidará de limpar user e role
  };

  const value = { user, role, loading, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
