import React, { useState, useEffect } from 'react';
import styles from './ManagePsychologists.module.css';
import { db, firebaseConfig } from '../firebase/config'; // Importa a configuração
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { initializeApp, deleteApp, FirebaseError } from 'firebase/app';
import type { Psychologist } from '../types';
import EditPsychologistForm from '../components/EditPsychologistForm';

const ManagePsychologists: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [socialName, setSocialName] = useState('');
  const [crp, setCrp] = useState('');
  const [phone, setPhone] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('manage');
  const [editingPsychologistId, setEditingPsychologistId] = useState<string | null>(null);

  const handleUpdateSuccess = () => {
    setEditingPsychologistId(null);
    setMessage('Psicólogo atualizado com sucesso!');
    fetchPsychologists();
  };

  const fetchPsychologists = async () => {
    setIsLoadingList(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'psychologists'));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Psychologist[];
      setPsychologists(list);
    } catch (err: unknown) {
      let errorMessage = "Não foi possível carregar a lista de psicólogos.";
      if (err instanceof Error) {
        errorMessage += ` Detalhe: ${err.message}`;
      }
      console.error("Erro ao buscar psicólogos para gerenciar:", err);
      setError(errorMessage);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleEditClick = (psyId: string) => {
    setEditingPsychologistId(currentId => (currentId === psyId ? null : psyId));
  };

  const handleDelete = async (psyId: string, photoURL?: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este psicólogo? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Deletar o documento do Firestore
      const docRef = doc(db, 'psychologists', psyId);
      await deleteDoc(docRef);

      // 2. Deletar a foto do Storage, se existir
      if (photoURL) {
        const storage = getStorage();
        const photoRef = ref(storage, photoURL);
        await deleteObject(photoRef);
      }

      // NOTA: A exclusão do usuário no Firebase Authentication requer uma Cloud Function para ser feita de forma segura pelo gerente.
      setMessage('Psicólogo excluído com sucesso.');
      setPsychologists(psychologists.filter(p => p.id !== psyId)); // Atualiza a lista
    } catch (err: unknown) {
      let errorMessage = "Falha ao excluir psicólogo. Tente novamente.";
      if (err instanceof Error) {
        errorMessage += ` Detalhe: ${err.message}`;
      }
      console.error("Erro ao excluir psicólogo:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    // Cria uma instância temporária do app para não deslogar o gerente
    const tempAppName = `temp-auth-app-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp); 

    try {
      // 1. Criar o usuário no Authentication usando a instância temporária
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const user = userCredential.user;

      // 2. Fazer upload da foto, se existir
      let photoURL = '';
      if (photoFile) {
        const storage = getStorage(tempApp);
        const photoRef = ref(storage, `psychologist-photos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // 3. Adicionar o perfil do psicólogo no Firestore (autenticado como gerente)
      await setDoc(doc(db, 'psychologists', user.uid), {
        name,
        email,
        socialName,
        crp,
        phone,
        bio,
        specialties: specialties.split(',').map(s => s.trim()),
        photoURL, // Adiciona a URL da foto ao documento
      });

      setMessage(`Psicólogo "${socialName}" criado com sucesso!`);
      setName('');
      setEmail('');
      setPassword('');
      setSocialName('');
      setCrp('');
      setPhone('');
      setBio('');
      setSpecialties('');
      setPhotoFile(null);
      setActiveTab('manage');
      fetchPsychologists(); // Atualiza a lista após o cadastro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown) {
      let errorMessage = "Erro ao criar psicólogo.";
      if (error instanceof FirebaseError) {
        errorMessage = `Erro ao criar psicólogo: ${error.message} (código: ${error.code})`;
        console.error('DETALHES DO ERRO AO CRIAR PSICÓLOGO:', error.code, error.message);
      } else if (error instanceof Error) {
        errorMessage = `Erro ao criar psicólogo: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      // Deleta a instância temporária do app
      await deleteApp(tempApp);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Gerenciar Psicólogos</h2>

      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'add' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Adicionar Novo
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'manage' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Gerenciar Existentes ({psychologists.length})
        </button>
      </div>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      {activeTab === 'add' && (
        <div className={`${styles.tabContent} ${styles.formContainer}`}>
          <h3>Adicionar Novo Psicólogo</h3>
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.formGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="socialName">Nome Social (será exibido)</label>
              <input type="text" id="socialName" value={socialName} onChange={(e) => setSocialName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="crp">CRP (Registro Profissional - ex: 06/158452)</label>
              <input type="text" id="crp" value={crp} onChange={(e) => setCrp(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone para Contato</label>
              <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="photo">Foto do Psicólogo</label>
              <input type="file" id="photo" onChange={handlePhotoChange} accept="image/*" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Biografia (Bio)</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="specialties">Especialidades (separadas por vírgula)</label>
              <input
                type="text"
                id="specialties"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="TCC, Ansiedade, Depressão"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha Inicial</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Psicólogo'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className={`${styles.tabContent} ${styles.listSection}`}>
          <h3>Psicólogos Cadastrados</h3>
          {isLoadingList ? (
            <p>Carregando lista...</p>
          ) : (
            <ul className={styles.psychologistList}>
              {psychologists.map(psy => (
                <li key={psy.id} className={styles.psychologistListItem}>
                  <div className={styles.psychologistItem}>
                    <img src={psy.photoURL || 'https://i.pravatar.cc/40?u=' + psy.id} alt={psy.socialName} className={styles.itemPhoto} />
                    <span className={styles.itemName}>{psy.socialName}</span>
                    <div className={styles.itemActions}>
                      <button className={styles.editButton} onClick={() => handleEditClick(psy.id)} disabled={isLoading}>
                        {editingPsychologistId === psy.id ? 'Fechar' : 'Editar'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(psy.id, psy.photoURL)}
                        disabled={isLoading}
                      >Excluir</button>
                    </div>
                  </div>
                  {editingPsychologistId === psy.id && (
                    <div className={styles.accordionContent}>
                      <EditPsychologistForm psychologist={psy} onUpdate={handleUpdateSuccess} onCancel={() => setEditingPsychologistId(null)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
export default ManagePsychologists;
