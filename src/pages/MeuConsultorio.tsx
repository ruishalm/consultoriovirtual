import React from 'react';
import styles from './MeuConsultorio.module.css';

const MeuConsultorio: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Meu Consultório</h1>
      <p>Esta é a sua sala de atendimento virtual. Quando uma consulta estiver para começar, o link para a chamada de vídeo aparecerá aqui.</p>
      <div className={styles.videoPlaceholder}>
        <p>Aguardando início da consulta...</p>
      </div>
    </div>
  );
};

export default MeuConsultorio;