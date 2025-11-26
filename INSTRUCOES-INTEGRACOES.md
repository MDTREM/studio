# Guia de Integrações Manuais

Este guia explica como integrar ferramentas essenciais de marketing e análise ao seu site. Essas etapas são manuais e exigem que você crie contas nesses serviços e copie os IDs correspondentes para o seu código.

## 1. Google Tag Manager (GTM)

O Google Tag Manager permite que você gerencie e implante tags de marketing (trechos de código ou pixels de rastreamento) em seu site sem precisar modificar o código.

### Passo 1: Obter seu ID do GTM

1.  Acesse o [Google Tag Manager](https://tagmanager.google.com/).
2.  Crie uma nova conta se ainda não tiver uma. Configure um contêiner para o seu site.
3.  Após a criação, o GTM fornecerá um ID no formato `GTM-XXXXXXX`. Você pode encontrá-lo no canto superior direito do seu painel do GTM.

### Passo 2: Adicionar o ID ao Código

1.  Abra o arquivo `src/app/layout.tsx` no seu projeto.
2.  Encontre a seção `<head>`. Dentro dela, você verá um comentário de exemplo para o Google Tag Manager.
3.  Substitua `GTM-XXXXXXX` pelo seu ID real do GTM.

**Antes:**
```html
{/*
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
*/}
```

**Depois (exemplo):**
```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ABC1234');</script>
```
**Importante:** Descomente o bloco de script removendo ` {/* ` no início e ` */}` no final.

## 2. Meta Pixel (antigo Facebook Pixel)

O Meta Pixel ajuda a medir, otimizar e criar públicos para suas campanhas publicitárias no Facebook e Instagram.

### Passo 1: Obter seu ID do Pixel

1.  Vá para o **Gerenciador de Eventos** no seu Gerenciador de Negócios do Facebook.
2.  Clique em **Conectar fontes de dados** e selecione **Web**.
3.  Siga as instruções para criar um Pixel.
4.  O Facebook fornecerá um ID numérico para o seu Pixel.

### Passo 2: Adicionar o ID ao Código

1.  Abra o mesmo arquivo `src/app/layout.tsx`.
2.  Encontre a seção comentada para o Meta Pixel.
3.  Substitua `YOUR_PIXEL_ID` pelo seu ID real do Pixel.

**Antes:**
```html
{/*
<script>
...
fbq('init', 'YOUR_PIXEL_ID');
...
</script>
<noscript><img height="1" width="1" style={{display:'none'}}
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
*/}
```

**Depois (exemplo):**
```html
<script>
...
fbq('init', '123456789012345');
...
</script>
<noscript><img height="1" width="1" style={{display:'none'}}
src="https://www.facebook.com/tr?id=123456789012345&ev=PageView&noscript=1"
/></noscript>
```
**Importante:** Assim como no GTM, descomente o bloco de script para ativá-lo.

Após adicionar esses códigos, seu site estará pronto para coletar dados de análise e marketing, permitindo que você entenda melhor seus visitantes e otimize suas campanhas de publicidade.
