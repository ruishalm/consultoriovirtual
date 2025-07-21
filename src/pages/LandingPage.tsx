import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import Card from '../components/Card';
import ArticleModal from '../components/ArticleModal';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import type { Psychologist, Article } from '../types';
import PsychologistProfileModal from '../components/PsychologistProfileModal';

const dummyArticles: Article[] = [
  {
    title: 'A Importância do Autocuidado',
    description: 'Entenda por que o autocuidado é fundamental para a saúde mental e como praticá-lo no dia a dia.',
    content: `O autocuidado vai muito além de um dia no spa. Envolve práticas diárias que nutrem sua mente, corpo e espírito. 
    
Desde uma alimentação balanceada e exercícios regulares até a definição de limites saudáveis em seus relacionamentos e a dedicação de tempo para hobbies que você ama. Priorizar o autocuidado é um ato de amor-próprio que fortalece sua resiliência emocional e previne o esgotamento. Comece pequeno: reserve 15 minutos do seu dia para uma atividade que te traga paz, como ler um livro, ouvir música ou simplesmente sentar em silêncio.`,
  },
  {
    title: 'Lidando com a Ansiedade',
    description: 'Estratégias e técnicas para gerenciar os sintomas da ansiedade e melhorar sua qualidade de vida.',
    content: `A ansiedade é uma resposta natural do corpo ao estresse, mas quando se torna crônica, pode ser debilitante. 
    
Técnicas de respiração profunda, como a respiração diafragmática, são ferramentas poderosas para acalmar o sistema nervoso em momentos de crise. A prática de mindfulness e meditação ajuda a treinar a mente para focar no presente, reduzindo a ruminação sobre preocupações futuras. Além disso, a Terapia Cognitivo-Comportamental (TCC) é altamente eficaz para identificar e reestruturar padrões de pensamento negativos que alimentam a ansiedade.`,
  },
  {
    title: 'Terapia Online: Benefícios e Mitos',
    description: 'Descubra as vantagens da terapia online e desmistifique os preconceitos sobre o atendimento virtual.',
    content: `A terapia online, ou teleterapia, remove barreiras geográficas e de tempo, tornando o cuidado com a saúde mental mais acessível. 
    
Um dos maiores mitos é que ela é menos eficaz que a terapia presencial, mas pesquisas mostram que, para muitas condições, os resultados são equivalentes. A conveniência de fazer terapia no conforto de sua casa pode, inclusive, ajudar a reduzir a ansiedade associada ao processo. É fundamental garantir que a plataforma utilizada seja segura e que o profissional seja licenciado, assegurando a confidencialidade e a qualidade do atendimento.`,
  },
];

const LandingPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'psychologists'));
        const psychologistsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Psychologist[];
        setPsychologists(psychologistsList);
      } catch (error) {
        console.error("Erro ao buscar psicólogos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroContent}>
          <h1>Encontre seu equilíbrio. Comece sua jornada.</h1>
          <p>
            O Consultório Virtual é um espaço seguro e acolhedor para você cuidar da sua saúde mental com
            profissionais qualificados, no conforto da sua casa.
          </p>
          <a href="#profissionais" className={styles.ctaButton}>Conheça nossos psicólogos</a>
        </div>
      </section>

      <section id="sobre" className={styles.section}>
        <h2>Sobre a Psicologia Clínica</h2>
        <p>
          A psicologia clínica é a área que se dedica ao estudo e tratamento dos transtornos mentais e ao
          bem-estar psicológico. Nosso objetivo é ajudar você a compreender seus sentimentos, pensamentos e
          comportamentos, desenvolvendo ferramentas para uma vida mais plena e saudável.
        </p>
      </section>

      <section id="artigos" className={`${styles.section} ${styles.lightSection}`}>
        <h2>Artigos e Reflexões</h2>
        <div className={styles.articlesGrid}>
          {dummyArticles.map((article, index) => (
            <Card
              key={index}
              title={article.title}
              description={article.description}
              onClick={() => setSelectedArticle(article)} />
          ))}
        </div>
      </section>

      <section id="profissionais" className={styles.section}>
        <h2>Nossos Profissionais</h2>
        <p>
          Contamos com uma equipe de psicólogos especializados em diversas áreas, prontos para oferecer o
          suporte que você precisa.
        </p>
        <div className={styles.psychologistsGrid}>
          {loading ? (
            <p>Carregando profissionais...</p>
          ) : (
            psychologists.map(psy => (
              <div key={psy.id} className={styles.psychologistCard}>
                <img
                  src={psy.photoURL || 'https://i.pravatar.cc/150?u=' + psy.id}
                  alt={`Foto de ${psy.socialName}`}
                  className={styles.psychologistPhoto}
                />
                <h3>{psy.socialName}</h3>
                <p className={styles.crp}>CRP: {psy.crp}</p>
                <p className={styles.bio}>{psy.bio}</p>
                <div className={styles.specialties}>
                  {psy.specialties.slice(0, 3).map(spec => ( // Mostra no máximo 3 especialidades
                    <span key={spec} className={styles.specialtyTag}>{spec}</span>
                  ))}
                </div>
                <button onClick={() => setSelectedPsychologist(psy)} className={styles.profileLink}>
                  Ver Perfil Completo
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaSection}`}>
        <h2>Pronto para dar o primeiro passo?</h2>
        <p>O agendamento é simples e rápido. Encontre o profissional ideal para você.</p>
        {/* O botão de login já está no Header, então não precisamos de outro aqui */}
      </section>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      <PsychologistProfileModal psychologist={selectedPsychologist} onClose={() => setSelectedPsychologist(null)} />
    </div>
  );
};

export default LandingPage;