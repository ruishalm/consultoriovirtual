import React, { useState, type JSX } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUsers, FaEnvelopeOpenText, FaStethoscope, FaAngleDown } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Recado {
  id: number;
  paciente: string;
  data: string;
  mensagem: string;
}

const dummyRecados: Recado[] = [
  { id: 1, paciente: 'Ana Silva', data: '25/07 10:30', mensagem: 'Gostaria de confirmar nossa sessão de amanhã. Obrigado!' },
  { id: 2, paciente: 'Carlos Souza', data: '24/07 18:15', mensagem: 'Tive um imprevisto e não poderei comparecer.' },
];

// Define os tipos para os itens da navegação para ajudar o TypeScript
type NavLinkItem = { to: string; text: string; icon: JSX.Element; };
type AccordionItem = { id: 'agenda' | 'recados'; text: string; icon: JSX.Element; };
type NavItem = NavLinkItem | AccordionItem;

const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [isRecadosOpen, setIsRecadosOpen] = useState(true); // Começa aberto
  const [activeRecadoId, setActiveRecadoId] = useState<number | null>(null);

  const getNavLinks = (): NavItem[] => {
    switch (role) {
      case 'psychologist':
        return [
          { id: 'agenda', text: 'Minha Agenda', icon: <FaCalendarAlt /> },
          { id: 'recados', text: 'Recados', icon: <FaEnvelopeOpenText /> },
          { to: '/dashboard/pacientes', text: 'Meus Pacientes', icon: <FaUsers /> },
          { to: '/dashboard/meu-consultorio', text: 'Meu Consultório', icon: <FaStethoscope /> },
        ];
      case 'patient':
        return [
          { to: '/dashboard/agendamentos', text: 'Meus Agendamentos', icon: <FaCalendarAlt /> }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  if (navLinks.length === 0) {
    return null; // Não renderiza a sidebar para o gerente, que tem navegação própria.
  }

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.navList}>
          {navLinks.map((link) => {
            // Type guard para itens de acordeão
            if ('id' in link) {
              if (link.id === 'agenda') {
                return (
                  <li key={link.id} className={styles.navItem}>
                    <button className={styles.sidebarSectionButton} onClick={() => setIsAgendaOpen(!isAgendaOpen)}>
                      {link.icon}
                      <span>{link.text}</span>
                      <FaAngleDown className={`${styles.chevron} ${isAgendaOpen ? styles.open : ''}`} />
                    </button>
                    <div className={`${styles.sidebarSectionContent} ${isAgendaOpen ? styles.open : ''}`}>
                      <DayPicker mode="single" className={styles.calendar} />
                    </div>
                  </li>
                );
              }
              // link.id === 'recados'
              return (
                <li key={link.id} className={styles.navItem}>
                  <button className={styles.sidebarSectionButton} onClick={() => setIsRecadosOpen(!isRecadosOpen)}>
                    {link.icon}
                    <span>{link.text}</span>
                    <FaAngleDown className={`${styles.chevron} ${isRecadosOpen ? styles.open : ''}`} />
                  </button>
                  <div className={`${styles.sidebarSectionContent} ${isRecadosOpen ? styles.open : ''}`}>
                    <div className={styles.recadosList}>
                      {dummyRecados.map(recado => (
                        <div key={recado.id} className={styles.recadoItem} onClick={() => setActiveRecadoId(activeRecadoId === recado.id ? null : recado.id)}>
                          <div className={styles.recadoHeader}>
                            <span className={styles.pacienteNome}>{recado.paciente}</span>
                            <span className={styles.dataHora}>{recado.data}</span>
                          </div>
                          {activeRecadoId === recado.id && <p className={styles.recadoBody}>{recado.mensagem}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }
            // Type guard para NavLink
            if ('to' in link) {
              return (
                <li key={link.to} className={styles.navItem}>
                  <NavLink to={link.to} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                    {link.icon}
                    <span>{link.text}</span>
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
