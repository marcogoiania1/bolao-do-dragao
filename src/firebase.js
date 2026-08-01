// ============================================================
// Conexão com o Firebase (Firestore) — substitui o antigo
// window.storage que só funcionava dentro do claude.ai.
//
// 1) Crie um projeto grátis em https://console.firebase.google.com
// 2) Ative o "Firestore Database" (modo produção ou teste, tanto faz pra começar)
// 3) Em "Configurações do projeto" > "Seus apps" > "Web", crie um app
//    e copie o objeto de configuração que aparece — cole aqui embaixo
//    no lugar do firebaseConfig de exemplo.
// 4) (Recomendado) Em Firestore > Regras, use algo como:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /palpitao_dados/{docId} {
//          allow read, write: if true; // simples: qualquer um com o link pode ler/escrever
//        }
//      }
//    }
//
//    Isso deixa o "banco" tão aberto quanto o storage compartilhado
//    do Claude era (qualquer participante com o link consegue usar).
//    Se quiser mais segurança depois, dá pra restringir por senha/token,
//    mas isso é um passo extra, não obrigatório pra funcionar.
// ============================================================

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// TODO: troque pelos dados do SEU projeto Firebase (Configurações do projeto > Seus apps)
const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY",
  authDomain: "SEU-PROJETO.firebaseapp.com",
  projectId: "SEU-PROJETO",
  storageBucket: "SEU-PROJETO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Todos os dados do bolão ficam em documentos dentro da coleção "palpitao_dados",
// um documento por chave (participantes / jogos / palpites), cada um guardando
// o mesmo JSON em string que o app já usava antes — troca mínima de código.
const COLECAO = "palpitao_dados";

export async function storageGet(chave) {
  const ref = doc(db, COLECAO, chave);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const dados = snap.data();
  return { value: dados.json ?? null };
}

export async function storageSet(chave, jsonString) {
  const ref = doc(db, COLECAO, chave);
  await setDoc(ref, { json: jsonString, atualizadoEm: Date.now() });
}
