import React from 'react';
import styles from './PsychologistProfileModal.module.css';
import type { Psychologist } from '../types';

interface PsychologistProfileModalProps {
  psychologist: Psychologist | null;
  onClose: () => void;
}

const PsychologistProfileModal: React.FC<PsychologistProfileModalProps> = ({ psychologist, onClose }) => {
  if (!psychologist) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.profileHeader}>
            <img
                src={psychologist.photoURL || `https://i.pravatar.cc/150?u=${psychologist.id}`}
                alt={`Foto de ${psychologist.socialName}`}
                className={styles.profilePhoto}
            />
            <div className={styles.headerText}>
                <h1>{psychologist.socialName}</h1>
                <p className={styles.crp}>CRP: {psychologist.crp}</p>
            </div>
        </div>
        <div className={styles.profileBody}>
            <h3>Sobre</h3>
            <p className={styles.bio}>{psychologist.bio}</p>
            <h3>Especialidades</h3>
            <ul className={styles.specialties}>
                {psychologist.specialties.map(spec => (
                    <li key={spec} className={styles.specialtyTag}>{spec}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfileModal;