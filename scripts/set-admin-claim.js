// Este script define um "custom claim" de administrador para um usuário do Firebase.
// Uso: node scripts/set-admin-claim.js <emailDoUsuario>

const admin = require('firebase-admin');
const path = require('path');

// --- Início da Configuração ---
// Caminho para o arquivo de chave de serviço que você vai gerar.
const serviceAccountPath = path.resolve(__dirname, 'firebase-admin-sdk.json');
// --- Fim da Configuração ---

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro: Não foi possível carregar o arquivo de chave de serviço `scripts/firebase-admin-sdk.json`.');
  console.error('Por favor, siga as instruções no arquivo `INSTRUCOES-ADMIN.md` para gerar e colocar este arquivo no local correto.');
  process.exit(1);
}

const email = process.argv[2];

if (!email) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro: Por favor, forneça um endereço de e-mail como argumento.');
  console.log('Uso: npm run set-admin -- <email@exemplo.com>');
  process.exit(1);
}

(async () => {
  try {
    console.log(`Buscando usuário: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);

    if (user.customClaims && user.customClaims.isAdmin === true) {
      console.log('\x1b[33m%s\x1b[0m', `O usuário ${email} já é um administrador.`);
      process.exit(0);
    }

    console.log('Definindo permissão de administrador...');
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });

    console.log('\x1b[32m%s\x1b[0m', `Sucesso! O usuário ${email} (UID: ${user.uid}) agora é um administrador.`);
    console.log('Pode levar alguns minutos para a permissão ser propagada. Por favor, faça logout e login novamente no aplicativo para que as alterações tenham efeito.');
    process.exit(0);

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('\x1b[31m%s\x1b[0m', `Erro: Usuário com o e-mail "${email}" não encontrado.`);
    } else {
      console.error('\x1b[31m%s\x1b[0m', 'Ocorreu um erro inesperado:');
      console.error(error);
    }
    process.exit(1);
  }
})();
