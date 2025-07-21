# Plano de Projeto: ConsultorioVirtual

**Lema:** "Simplicidade é a sofisticação suprema"

**Repositório:** [https://github.com/ruishalm/consultoriovirtual.git](https://github.com/ruishalm/consultoriovirtual.git)

---

## Stack Tecnológica

*   **Frontend:** React (Vite) + TypeScript
*   **Backend (BaaS):** Firebase (Authentication, Firestore)
*   **API de Vídeo:** Whereby (Embedded)
*   **Estilização:** CSS Modules
*   **Roteamento:** `react-router-dom`

---

## Fase 0: Preparação e Configuração

**Objetivo:** Montar o esqueleto do projeto e configurar as ferramentas.

1.  **Inicializar Projeto:**
    *   Comando: `npm create vite@latest ConsultorioVirtual -- --template react-ts`

2.  **Instalar Dependências:**
    *   Comando: `npm install firebase react-router-dom react-day-picker`

3.  **Estrutura de Pastas (`src/`):**
    *   `components/`: Componentes reutilizáveis (Button, Modal, seu `Logo.tsx`, etc.).
    *   `pages/`: Telas da aplicação (LandingPage, Dashboard, etc.).
    *   `hooks/`: Hooks customizados (ex: `useAuth`).
    *   `contexts/`: Contextos globais (ex: `AuthContext`).
    *   `firebase/`: Configuração e funções de serviço do Firebase.
    *   `types/`: Definições de tipos (interfaces) do TypeScript.

4.  **Configurar Firebase:**
    *   Criar arquivo `.env` na raiz do projeto para as credenciais.
    *   Criar `src/firebase/config.ts` para inicializar o Firebase (conforme arquivo gerado).

5.  **Configurar Whereby:**
    *   Criar conta e obter a URL da sala de vídeo para cada psicólogo.

---

## Fase 1: Estrutura Base, Roteamento e Autenticação

**Status:** 🏁 **Concluído**

1.  **Páginas Públicas:**
    *   [x] `LandingPage.tsx`: Apresentação, artigos e cards dos psicólogos.

2.  **Roteamento (`App.tsx`):**
    *   [x] Configurar `react-router-dom` com as rotas principais.

3.  **Autenticação:**
    *   [x] `LoginModal.tsx`: Formulário de login.
    *   [x] `AuthContext.tsx`: Prover estado do usuário (`user`, `role`) e verificação de papéis.

4.  **Rotas Protegidas:**
    *   [x] `ProtectedRoute.tsx`: Protege rotas para usuários logados.
    *   [x] `ManagerRoute.tsx`: Protege rotas exclusivas para gerentes.

---

## Fase 2: Gerenciamento e Dashboards

**Status:** 🚧 **Em Andamento**

1.  **Dashboard do Gerente:**
    *   [x] `Dashboard.tsx`: Visualização inicial para o gerente.
    *   [x] `ManagePsychologists.tsx`: Página de gerenciamento com abas.
    *   [x] Funcionalidade de **Adicionar** psicólogo (com upload de foto).
    *   [x] Funcionalidade de **Listar** e **Excluir** psicólogos.
    *   [ ] **Próximo Passo:** Implementar a funcionalidade de **Editar** psicólogo.

2.  **Agendamento:**
    *   **Psicólogo:** Criar UI para definir sua disponibilidade (salvar no seu documento no Firestore).
    *   **Paciente:** Usar `react-day-picker`. Ao selecionar um dia, buscar disponibilidade e agendamentos existentes para mostrar apenas horários livres. Ao clicar, criar documento na coleção `appointments`.

3.  **Criação de Pacientes (Fluxo do Psicólogo):**
    *   Formulário para o psicólogo cadastrar um novo paciente.
    *   Usar `createUserWithEmailAndPassword`.
    *   Após criar no Auth, criar o documento na coleção `patients` com o `psychologistId` correto.

---

## Fase 3: O Consultório Virtual

**Objetivo:** Integrar a chamada de vídeo e a lógica de "abrir a sala".

1.  **Página do Consultório (`Consultorio.tsx`):**
    *   Layout com vídeo no centro e informações (agenda, anotações) na lateral.

2.  **Integração Whereby:**
    *   Renderizar um `<iframe>` com a `src` sendo a URL da sala do psicólogo (armazenada no seu documento do Firestore).

3.  **Lógica de Abertura de Sala:**
    *   **Psicólogo:** Botão "Iniciar Atendimento" atualiza o campo `isRoomOpen: true` no documento do agendamento.
    *   **Paciente:** Um listener (`onSnapshot`) no dashboard do paciente observa a mudança em `isRoomOpen` e habilita o botão "Entrar no Consultório".

---

## Fase 4: Funcionalidades de Suporte e Segurança

**Objetivo:** Adicionar as ferramentas de comunicação e travar a segurança.

1.  **Anotações e Recados:**
    *   **Anotações:** Área de texto para o psicólogo, que salva na coleção `patientNotes`.
    *   **Recados:** Formulário para o paciente enviar mensagens (cria doc na coleção `messages`). O psicólogo visualiza e pode apagar.

2.  **Regras de Segurança do Firestore:**
    *   **CRÍTICO:** Escrever regras detalhadas no Console do Firebase para garantir que um usuário só possa acessar e modificar os dados que lhe pertencem.

---

## Fase 5: Finalização e Deploy

1.  **Polimento:** Revisão da UI/UX, testes de todos os fluxos, garantir responsividade.
2.  **Deploy:** Publicar o site usando Vercel ou Netlify, configurando as variáveis de ambiente do Firebase.