import React from 'react';
import styles from './Footer.module.css';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Consultório Virtual. Todos os direitos reservados.
      </div>
      <div className={styles.developerCredit}>
        <span>Desenvolvido por</span>
        <Logo href="https://github.com/ruishalm" size="small" firstName="Rafa" lastName="Munhoz" color="#B91C1C" openInNewTab={true} />
      </div>
    </footer>
  );
};

export default Footer;