# SAAB Multimarcas — Website V1

Website institucional + catálogo digital de veículos da **SAAB Multimarcas** (Presidente Prudente/SP).
Desenvolvido por **NESX Performance & Growth**.

> 🔒 **Documentação interna — dados provisórios.** A interface não exibe avisos de demonstração (V3), mas o conteúdo
> ainda é provisório: sem Supabase, o catálogo mostra **12 veículos fictícios** com fotos de referência dos modelos
> (Wikimedia Commons), e não o estoque da SAAB. Use somente em **pré-visualização privada** (ver "Pré-visualização privada").

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · Lucide · Supabase (Auth, Postgres, Storage) · Vercel.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional — tudo funciona sem preencher
npm run dev                  # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run build` | Typecheck + build + pré-renderização (meta tags por rota, sitemap, robots) |
| `npm run preview` | Serve o build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (filtros, WhatsApp, páginas) |
| `npm run generate:demo-images` | Regera as ilustrações SVG de demonstração |

## Deploy na Vercel

1. Importe o repositório (framework detectado: Vite; `vercel.json` já define build, rewrites da SPA e headers).
2. Configure as variáveis de ambiente (veja `.env.example`). Mínimo recomendado: `VITE_SITE_URL` e `VITE_WHATSAPP_NUMBER`.
3. Só defina `VITE_ALLOW_INDEXING=true` quando o site tiver dados reais e domínio definitivo.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Dados da empresa, WhatsApp, endereço, mapa, horários, redes, logotipo, serviços habilitados | `src/config/site.ts` |
| Headline, textos comerciais, diferenciais, sobre, venda/troca, financiamento | `src/config/content.ts` |
| Cor da marca (azul, provisório `#1254B8`) e tokens visuais | `src/styles/index.css` (`--color-brand*`) |
| Fotos de referência dos modelos de exemplo + foto do banner | `src/data/stock-photos.ts` |
| Depoimentos reais (seção fica oculta enquanto vazio) | `src/data/reviews.ts` |
| Veículos de demonstração | `src/data/demo-vehicles.ts` |
| Política de Privacidade (minuta) | `src/pages/PrivacyPage.tsx` |

Flags úteis em `siteConfig`: `services.financing` (habilita a página/rota de financiamento), `services.sell/trade/buy`,
`address.confirmed` (exibe endereço + mapa + JSON-LD da loja), `showProvisionalMarkers` (selos "Conteúdo provisório").

## Arquitetura

```
src/
  config/        site.ts, content.ts, navigation.ts, env.ts  ← configuração centralizada
  types/         Vehicle, Review
  data/          dados de demonstração e depoimentos
  services/
    vehicles/    VehicleRepository (demo | supabase) + mapper snake_case ↔ camelCase
    admin/       auth + CRUD administrativo + upload de imagens (Supabase)
  lib/           filtros do estoque, WhatsApp, analytics, SEO, formatação (lógica pura e testada)
  hooks/         VehiclesProvider (catálogo carregado uma vez), useInventoryFilters (estado ↔ URL)
  components/    layout/, ui/, vehicles/, home/
  pages/         páginas públicas + admin/ (lazy-loaded)
scripts/         prerender.ts (pós-build), generate-demo-images.ts
supabase/        migrations/ (tabelas, RLS, Storage)
```

- **Fonte de dados**: `getVehicleRepository()` escolhe Supabase quando `VITE_SUPABASE_URL/ANON_KEY` existem; caso contrário,
  demonstração. O SDK do Supabase não é carregado no modo demonstração.
- **Integração futura com CRM**: os pontos de contato passam por `WhatsAppButton`/`trackEvent` e pelos construtores de
  mensagem em `src/lib/whatsapp.ts` — é ali que um envio de lead para CRM seria acoplado.

## Painel administrativo (`/admin`)

Sem Supabase, `/admin` mostra "Painel indisponível" — **nenhum CRUD é simulado**. Com Supabase:

1. Crie o projeto e rode `supabase/migrations/20261027000000_catalogo_inicial.sql` (SQL Editor ou `supabase db push`).
2. Em *Authentication*, crie o usuário administrador e **desative novos cadastros** públicos.
3. Registre o administrador: `insert into public.admin_users (user_id) select id from auth.users where email = '...';`
4. Defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (chave **anon**; nunca a `service_role`).

Funções: login, listagem com busca, cadastro/edição, upload múltiplo de fotos (redimensionadas para WebP no navegador),
ordenação/capa, exclusão, publicar/despublicar, status (disponível/reservado/vendido) e destaque.
Segurança: RLS — visitantes só leem `published = true`; escrita em `vehicles` e no bucket `vehicle-images` exige `is_admin()`.

## SEO em uma SPA — abordagem adotada

O app renderiza no cliente. Para não depender só da execução de JavaScript:

1. **Pré-renderização de metadados no build** (`scripts/prerender.ts`): para cada rota pública e cada veículo publicado, gera
   um HTML com `title`, `description`, `canonical`, Open Graph e JSON-LD próprios. A Vercel serve esses arquivos diretamente
   (`cleanUrls`), então links compartilhados no WhatsApp/Facebook exibem o título e a imagem certos.
2. **Atualização em runtime** (`useSeo`): ao navegar, title/meta/canonical/JSON-LD são atualizados; o Google renderiza JS.
3. **Sitemap e robots** gerados no build. Veículos de demonstração **nunca** entram no sitemap, recebem `noindex` e não geram
   dados estruturados. Com `VITE_ALLOW_INDEXING != true`, todo o site fica `noindex` e o robots.txt bloqueia rastreadores.
4. **Limitação**: veículos cadastrados após o deploy funcionam normalmente (fallback da SPA), mas só ganham HTML pré-gerado no
   próximo build. Recomendação: criar um *Deploy Hook* na Vercel e acioná-lo por um *Database Webhook* do Supabase em
   inserts/updates de `vehicles` (ou rebuild diário). Evolução futura, se necessário: SSR/SSG (ex.: React Router framework mode).

## Mensuração

Eventos (`src/lib/analytics.ts`): `contact_click` (WhatsApp/Instagram/mapa, com posição do botão e veículo), `vehicle_view`,
`inventory_filter`, `quick_search`, `share_click`, `trade_in_submit` e `page_view`/`virtual_page_view` por rota.
Só carregam com `VITE_GTM_ID` ou `VITE_GA4_ID` **e** consentimento do visitante (banner exibido apenas se houver ID).
`contact_click` mede **cliques**, não leads confirmados.

## Imagens

- **Fotos de referência (V2):** cada modelo de exemplo e o banner usam uma fotografia real do **Wikimedia Commons**
  (licenças CC0 / CC BY / CC BY-SA), carregada pelo navegador do visitante via `Special:FilePath` com `srcset` responsivo.
  Créditos exibidos na galeria, no banner e na página `/creditos-de-imagens` (exigência das licenças). Confira autor e
  licença em cada página de origem antes da publicação definitiva.
- **Fallback:** se uma foto remota falhar, o componente `Photo` troca automaticamente pela ilustração local
  (`public/demo/`), então nenhuma imagem aparece quebrada.
- Substitua pelas fotos oficiais: estoque via painel administrativo; banner em `content.hero.image`; fachada em
  `content.about.image`; galeria institucional em `content.aboutPage.gallery`.

## Diretrizes de layout (V2)

Tipografia: **Plus Jakarta Sans** (títulos) + **DM Sans** (textos), auto-hospedadas via Fontsource. Textos centralizados e cada bloco com **no máximo duas linhas** (desktop e mobile). Mantenha os textos de
`src/config/content.ts` curtos. Exceções intencionais: a Política de Privacidade (texto jurídico) e o painel administrativo.

## Pré-visualização privada

Enquanto houver veículos fictícios, o site não deve ser público nem indexado:

- `VITE_ALLOW_INDEXING` diferente de `true` ⇒ `noindex` em todas as páginas e `robots.txt` bloqueando rastreadores (padrão).
- Na Vercel, ative **Settings → Deployment Protection → Vercel Authentication** (ou *Password Protection*) para exigir
  login/senha de quem acessar o link durante a apresentação.

## Pendências do cliente (interno)

Itens provisórios — nada disso aparece como aviso na interface; blocos sem dado confirmado ficam ocultos:

| Item | Onde preencher | Situação na interface |
| --- | --- | --- |
| Estoque real (veículos e fotos) | Painel `/admin` (Supabase) | 12 veículos fictícios com fotos de referência |
| WhatsApp | `VITE_WHATSAPP_NUMBER` / `site.ts` | Link abre o WhatsApp sem destinatário fixo |
| Endereço, mapa, horários, telefone, e-mail | `src/config/site.ts` | Exibe só "Presidente Prudente · SP"; demais ocultos |
| Logotipo oficial e tom exato de azul | `site.ts` (`logo`) e `index.css` (`--color-brand*`) | Logotipo tipográfico + `#1254B8` |
| História e propósito | `content.aboutPage.history/purpose` | Blocos ocultos |
| Diferenciais (página Sobre) | `content.differentials` | Textos genéricos a validar |
| Fotos da fachada/equipe | `content.about.image`, `content.aboutPage.gallery` | Painel com a marca |
| Créditos de 6 fotos (autor/licença) | `src/data/stock-photos.ts` | Link para a origem no Commons |
| Revisão jurídica da Política de Privacidade | `src/pages/PrivacyPage.tsx` | Minuta |
| Avaliações reais | `src/data/reviews.ts` | Seção oculta |
