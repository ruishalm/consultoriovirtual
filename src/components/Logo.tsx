import React from 'react';
import styles from './Logo.module.css';

// Define as propriedades que o componente pode receber
interface LogoProps {
  variant?: 'default' | 'inverse';
  size?: 'normal' | 'small';
  href?: string;
  title?: string;
  firstName: string;
  lastName: string;
  color?: string;
  openInNewTab?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'normal',
  href = '#',
  title = 'Página Inicial',
  firstName,
  lastName,
  color,
  openInNewTab = false,
}) => {
  // Combina a classe base com a classe da variante para aplicar as cores corretas
  const logoClassName = `${styles.rafaMunhozLogo} ${styles[variant]} ${styles[size]}`;
  const style = color ? ({ '--logo-color': color } as React.CSSProperties) : {};

  return (
    <a href={href} className={styles.svgLogoLink} title={title} target={openInNewTab ? '_blank' : '_self'} rel="noopener noreferrer" style={style}>
      <svg className={logoClassName} viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg">
        <rect className={styles.logoBgCapsule} x="-10" y="-5" width="240" height="50" rx="25"/>
        <path className={styles.logoFlair} transform="translate(-5, -5) scale(2.0)" d="M5,0.7 L9.33,7.5 L0.67,7.5 Z M5,9.3 L0.67,2.5 L9.33,2.5 Z" />
        <text x="20" y="27">
            <tspan className={styles.logoFirstName}>{firstName}</tspan><tspan className={styles.logoLastName}> {lastName}</tspan>
        </text>
        <path className={styles.logoUnderline} d="M20 35 H 215" />
      </svg>
    </a>
  );
};

export default Logo;