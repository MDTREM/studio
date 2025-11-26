# Como Configurar o Checkout com Stripe

Para que o pagamento funcione, você precisa configurar as chaves de API da Stripe no seu projeto. Siga estes passos **exatamente**.

### Passo 1: Criar um Arquivo de Ambiente Local

1.  Na raiz do seu projeto, crie um novo arquivo chamado `.env.local`. Este arquivo guardará suas chaves secretas e não será enviado para o controle de versão (como o Git).

2.  Copie o conteúdo abaixo para o seu novo arquivo `.env.local`:

    ```env
    # ===============================================
    # CHAVES DA STRIPE
    # Encontre-as em: https://dashboard.stripe.com/apikeys
    # ===============================================

    # Chave Publicável (Publishable key) - Segura para usar no front-end
    # Começa com "pk_test_..." ou "pk_live_..."
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

    # Chave Secreta (Secret key) - MANTENHA SECRETA! Usada apenas no back-end.
    # Começa com "sk_test_..." ou "sk_live_..."
    STRIPE_SECRET_KEY=

    # ===============================================
    # STRIPE WEBHOOK SECRET (OPCIONAL, MAS RECOMENDADO)
    # Encontre em: https://dashboard.stripe.com/webhooks
    # ===============================================
    # STRIPE_WEBHOOK_SECRET=
    ```

### Passo 2: Obter Suas Chaves da Stripe

1.  **Acesse seu Painel da Stripe:** Vá para [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2.  **Encontre as Chaves:**
    *   **Chave publicável (Publishable key):** Esta chave é segura para ser exposta. Copie o valor dela.
    *   **Chave secreta (Secret key):** Clique em "**Revelar chave de teste**" (ou "Revelar chave de produção") para ver e copiar esta chave. **Trate-a como uma senha!**

### Passo 3: Adicionar as Chaves ao Arquivo `.env.local`

1.  **Cole a Chave Publicável:** No arquivo `.env.local`, cole a chave que começa com `pk_...` logo após `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`.
2.  **Cole a Chave Secreta:** Cole a chave que começa com `sk_...` logo após `STRIPE_SECRET_KEY=`.

Seu arquivo deve ficar parecido com isto (com suas chaves reais):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SEU_VALOR_DA_CHAVE_PUBLICA
STRIPE_SECRET_KEY=sk_test_SEU_VALOR_DA_CHAVE_SECRETA
```

### Passo 4: Reiniciar o Servidor de Desenvolvimento

Para que as novas variáveis de ambiente sejam carregadas, você precisa **parar e iniciar novamente** o servidor de desenvolvimento.

1.  No terminal onde o projeto está rodando, pressione `Ctrl + C`.
2.  Inicie o servidor novamente com `npm run dev`.

Pronto! Seu projeto agora está configurado para se comunicar com a Stripe e processar pagamentos.
