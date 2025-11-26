# Como se tornar um administrador

Este projeto usa Firebase Custom Claims para gerenciar as permissões de administrador. Para que o painel de administração funcione, você precisa dar à sua conta de usuário a "claim" de `isAdmin`.

Siga estes passos **exatamente**.

### Passo 1: Gerar a Chave de Serviço do Firebase

1.  **Abra o Console do Firebase:** Vá para o seu projeto no [Firebase Console](https://console.firebase.google.com/).
2.  **Configurações do Projeto:** Clique no ícone de engrenagem ao lado de "Project Overview" e selecione "Project settings".
3.  **Contas de Serviço:** Vá para a aba "Service accounts".
4.  **Gerar Nova Chave Privada:** Clique no botão "**Generate new private key**". Um aviso aparecerá. Clique em "**Generate key**" para confirmar.
5.  **Salve o Arquivo:** O navegador fará o download de um arquivo JSON. Este arquivo é a sua chave de serviço. **Guarde-o com segurança!**

### Passo 2: Adicionar a Chave de Serviço ao Projeto

1.  **Renomeie o Arquivo:** Renomeie o arquivo JSON que você baixou para `firebase-admin-sdk.json`.
2.  **Mova o Arquivo:** Mova este arquivo para a pasta `scripts/` na raiz do seu projeto. Ele deve substituir o arquivo de exemplo que já está lá.

**IMPORTANTE:** O caminho final do arquivo deve ser `scripts/firebase-admin-sdk.json`.

### Passo 3: Executar o Script para se Tornar Admin

1.  **Instale as Dependências:** Se você ainda não o fez, abra um terminal na raiz do projeto e rode:
    ```bash
    npm install
    ```
2.  **Rode o Script:** No mesmo terminal, execute o seguinte comando, substituindo `seu-email@exemplo.com` pelo e-mail da conta que você quer tornar administradora:
    ```bash
    npm run set-admin -- seu-email@exemplo.com
    ```
    **Atenção:** Note os `--` depois de `set-admin`. Eles são importantes.

3.  **Verifique o Sucesso:** O terminal deve exibir uma mensagem de sucesso, confirmando que o usuário agora é um administrador.

### Passo 4: Testar no Aplicativo

1.  **Faça Logout e Login:** Volte para o seu aplicativo, faça logout e depois faça login novamente com a conta que você acabou de promover. Isso força o Firebase a atualizar seu token de autenticação com a nova permissão `isAdmin`.
2.  **Acesse o Painel:** Tente acessar o painel `/admin`. O erro de permissão deve ter desaparecido.
