# Bolão do Dragão — versão hospedada fora do Claude

Esta é a mesma aplicação (`BolaoDragao_on_v1.jsx`), só que adaptada pra
rodar como um site normal, fora do claude.ai, usando o **Firebase
(Firestore)** como banco de dados no lugar do `window.storage`.

Com isso, **ninguém mais precisa ter conta no Claude** pra usar o bolão —
só precisa do link do site.

O que muda pra você, comparado com o app antigo:
- Todas as funcionalidades continuam iguais (cadastro, jogos, palpites,
  pontuação, classificação, desempenho, exportar/importar, etc).
- O "banco de dados" agora é o Firestore, não mais o storage do Claude.
- Você (ou quem for hospedar) precisa criar uma conta gratuita no Firebase
  uma única vez.

---

## Passo 1 — Criar o projeto no Firebase (grátis)

1. Acesse **https://console.firebase.google.com** e entre com uma conta Google.
2. Clique em **"Adicionar projeto"**, dê um nome (ex: `bolao-do-dragao`) e finalize a criação.
3. No menu lateral, clique em **"Compilação" > "Firestore Database"**.
4. Clique em **"Criar banco de dados"**. Pode escolher **"Iniciar no modo de teste"**
   (mais simples pra começar — dá pra travar o acesso depois se quiser).
5. Ainda no console, clique no ícone de engrenagem > **"Configurações do projeto"**.
6. Na aba **"Geral"**, role até **"Seus apps"** e clique no ícone **`</>`** (Web) pra
   criar um app.
7. Dê um apelido (ex: `bolao-web`) e clique em **"Registrar app"**.
8. O Firebase vai mostrar um bloco de código com um objeto `firebaseConfig`
   parecido com isto:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "bolao-do-dragao.firebaseapp.com",
     projectId: "bolao-do-dragao",
     storageBucket: "bolao-do-dragao.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
   };
   ```

9. Copie esse objeto e cole no arquivo **`src/firebase.js`** deste projeto,
   substituindo o `firebaseConfig` de exemplo que já está lá.

### Regras do Firestore (importante)

No console do Firebase, vá em **Firestore Database > Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /palpitao_dados/{docId} {
      allow read, write: if true;
    }
  }
}
```

Isso deixa o banco tão aberto quanto o storage compartilhado do Claude era
(qualquer pessoa com o link do site consegue usar o bolão normalmente).
Clique em **"Publicar"** depois de colar.

---

## Passo 2 — Rodar localmente pra testar (opcional, mas recomendado)

Você vai precisar do **Node.js** instalado no computador
(https://nodejs.org, versão 18 ou mais recente).

```bash
cd bolao-dragao
npm install
npm run dev
```

Isso abre o site em `http://localhost:5173`. Teste o cadastro, os jogos e
os palpites antes de publicar de vez.

---

## Passo 3 — Publicar o site (grátis)

A forma mais simples é usando a **Vercel** ou o **Netlify**. Os dois têm
plano gratuito e publicam sites como este em poucos cliques.

### Opção A — Vercel

1. Suba esta pasta pra um repositório no GitHub (ou use o botão de importar
   pasta direto da Vercel, se disponível).
2. Acesse **https://vercel.com**, entre com sua conta GitHub.
3. Clique em **"Add New" > "Project"** e selecione o repositório.
4. A Vercel detecta automaticamente que é um projeto Vite — não precisa
   mudar nada nas configurações de build.
5. Clique em **"Deploy"**. Em cerca de 1 minuto você recebe um link público
   (algo como `bolao-do-dragao.vercel.app`).

### Opção B — Netlify

1. Rode `npm run build` localmente (isso gera uma pasta `dist/`).
2. Acesse **https://app.netlify.com**, entre com sua conta.
3. Arraste a pasta `dist/` pra área de "deploy manual" do Netlify.
4. Pronto — você recebe um link público na hora.

---

## Passo 4 — Migrar os dados do app antigo (se já tinha gente cadastrada)

Como o **formato dos dados não mudou** (só trocamos onde eles ficam
guardados), o processo é o mesmo de sempre:

1. No app **antigo** (dentro do Claude), vá em **Exportar/Importar** e exporte
   os dados (participantes, jogos e palpites).
2. Abra o **novo site** (já publicado), entre como Admin (o primeiro
   cadastro vira Admin, igual antes) e use a mesma tela de
   **Exportar/Importar** pra importar o arquivo que você exportou.

---

## Passo 5 — Continuar o desenvolvimento com o Claude

Sempre que quiser pedir ajustes, pode voltar numa conversa com o Claude e
anexar os arquivos deste projeto (principalmente `src/App.jsx`). Como agora
o app não depende mais do Claude pra rodar, o Claude só precisa te ajudar a
editar o código — você é quem publica a nova versão (repetindo o Passo 3)
depois.

**Lembrete:** antes de qualquer alteração grande, exporte os dados
(participantes/jogos/palpites) pela tela do próprio app, do mesmo jeito que
já era recomendado antes — é uma proteção simples contra qualquer imprevisto.

---

## Estrutura do projeto

```
bolao-dragao/
├── index.html          → página HTML base (Vite)
├── package.json        → dependências (React, Firebase, Recharts, ícones)
├── vite.config.js       → configuração do Vite
├── src/
│   ├── main.jsx         → ponto de entrada, renderiza o <PalpitaoApp />
│   ├── App.jsx          → o app inteiro (mesmo código de antes, só trocando
│   │                      window.storage por Firestore)
│   └── firebase.js      → configuração do Firebase + funções storageGet/storageSet
```
