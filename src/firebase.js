// ============================================================
// Conexão com o Firebase (Firestore) — substitui o antigo
// window.storage que só funcionava dentro do claude.ai.
// ============================================================

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBfcE9yJOcB67z96oxmXAmZ2xWHYxbYME",
  authDomain: "bolaodragao.firebaseapp.com",
  projectId: "bolaodragao",
  storageBucket: "bolaodragao.firebasestorage.app",
  messagingSenderId: "839845476901",
  appId: "1:839845476901:web:a24e0a091c3c7be847ddcc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
