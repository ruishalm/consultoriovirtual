import React from 'react';
import styles from './ArticleModal.module.css';

interface Article {
  title: string;
  content: string;
}

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{article.title}</h2>
        <p>{article.content}</p>
      </div>
    </div>
  );
};

export default ArticleModal;