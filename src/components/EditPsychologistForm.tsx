import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';
import type { Psychologist } from '../types';
import styles from './EditPsychologistForm.module.css';

interface EditPsychologistFormProps {
  psychologist: Psychologist;
  onUpdate: () => void;
  onCancel: () => void;
}

const EditPsychologistForm: React.FC<EditPsychologistFormProps> = ({ psychologist, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    socialName: psychologist.socialName,
    crp: psychologist.crp,
    phone: psychologist.phone,
    bio: psychologist.bio,
    specialties: psychologist.specialties.join(', '),
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updatedData: Partial<Psychologist> = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()),
      };

      if (photoFile) {
        const storage = getStorage();
        if (psychologist.photoURL) {
          try {
            const oldPhotoRef = ref(storage, psychologist.photoURL);
            await deleteObject(oldPhotoRef);
          } catch (deleteError: unknown) {
            if (
              deleteError instanceof FirebaseError &&
              deleteError.code !== 'storage/object-not-found'
            ) {
              console.error("Não foi possível deletar a foto antiga:", deleteError);
            }
          }
        }
        const newPhotoRef = ref(storage, `psychologist-photos/${psychologist.id}`);
        await uploadBytes(newPhotoRef, photoFile);
        updatedData.photoURL = await getDownloadURL(newPhotoRef);
      }

      const docRef = doc(db, 'psychologists', psychologist.id);
      await updateDoc(docRef, updatedData as { [x: string]: unknown });

      onUpdate();
    } catch (err: unknown) {
      let errorMessage = "Falha ao atualizar. Tente novamente.";
      if (err instanceof Error) {
        errorMessage += ` Detalhe: ${err.message}`;
      }
      console.error("Erro ao atualizar psicólogo:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor={`socialName-${psychologist.id}`}>Nome Social</label>
          <input type="text" id={`socialName-${psychologist.id}`} name="socialName" value={formData.socialName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor={`crp-${psychologist.id}`}>CRP</label>
          <input type="text" id={`crp-${psychologist.id}`} name="crp" value={formData.crp} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor={`phone-${psychologist.id}`}>Telefone</label>
          <input type="text" id={`phone-${psychologist.id}`} name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor={`photo-${psychologist.id}`}>Nova Foto (opcional)</label>
          <input type="file" id={`photo-${psychologist.id}`} name="photo" onChange={handlePhotoChange} accept="image/*" />
        </div>
        <div className={styles.formGroupFull}>
          <label htmlFor={`bio-${psychologist.id}`}>Biografia</label>
          <textarea id={`bio-${psychologist.id}`} name="bio" value={formData.bio} onChange={handleChange} rows={4} required />
        </div>
        <div className={styles.formGroupFull}>
          <label htmlFor={`specialties-${psychologist.id}`}>Especialidades (separadas por vírgula)</label>
          <input type="text" id={`specialties-${psychologist.id}`} name="specialties" value={formData.specialties} onChange={handleChange} required />
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isLoading}>Cancelar</button>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</button>
      </div>
    </form>
  );
};

export default EditPsychologistForm;