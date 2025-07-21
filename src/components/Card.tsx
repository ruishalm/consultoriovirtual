import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onClick} className={styles.cardLink}>Leia mais</button>
    </div>
  );
};

export default Card;