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

## Imagens (registro interno de origem e licença)

Nenhum rótulo de crédito aparece sobre as fotos. A atribuição exigida pelas licenças CC BY-SA é publicada em
`/informacoes-legais` (link "Informações legais" no rodapé), forma admitida pela licença ("URI ou link para recurso com as
informações"). Registro completo por arquivo: `src/data/stock-photos.ts`.

| Uso | Origem | Licença | Atribuição obrigatória? |
| --- | --- | --- | --- |
| Banner (principal) | [Pexels 10945892](https://www.pexels.com/photo/a-parked-blue-bmw-car-10945892/) — Alex Urezkov | Licença Pexels | Não |
| Banner (alternativas) | Pexels 17539749 e 6920503 | Licença Pexels | Não |
| Galerias dos 7 veículos | Wikimedia Commons — séries numeradas de Damian B Oh (uma sessão = um carro) | CC BY-SA 4.0 | Sim → `/informacoes-legais` |

**Auditoria das galerias (todas do mesmo carro, mesma sessão):**

| Veículo | Fotos | Arquivos | Verificação |
| --- | --- | --- | --- |
| BMW 320i M Sport (azul) | 6 | Portimao Blue (1,3,5,10,12,16) | (1)–(6), (10), (12), (16) confirmados; série (1)–(20) |
| Kia Sportage Signature (branco) | 6 | Snow White Pearl (1,3,6,10,15,20) | (3) confirmado; série (1)–(23) listada na categoria |
| Tesla Model Y (cinza) | 5 | Stealth Grey (1,3,5,7,8) | todos confirmados |
| Mercedes-Benz C 300 AMG Line (preto) | 5 | Obsidian Black (1,3,5,7,10) | (1) e (10) confirmados |
| Hyundai Elantra (branco) | 5 | Avante CN7 white (1,3,5,7,10) | (1) e (10) confirmados |
| Kia Carnival Hi-Limousine (bege) | 4 | Cotton Beige (2,4,12,22) | todos confirmados |
| Hyundai Tucson Inspiration (cinza) | 4 | Amazon Gray (4,2,1,3) | (2) e (4) confirmados |

- O ambiente de desenvolvimento não acessa Pexels/Wikimedia: **confira as galerias no site publicado.** Se um arquivo não
  carregar, a galeria o remove automaticamente (nunca mostra imagem de outro carro); só se todos falharem aparece a
  ilustração local.
- Galeria: miniaturas, anterior/próxima, teclado, gesto de deslizar e ampliação em tela cheia.

## Diretrizes de layout (V2)

Tipografia: **Plus Jakarta Sans** (títulos) + **DM Sans** (textos), auto-hospedadas via Fontsource. Textos centralizados e cada bloco com **no máximo duas linhas** (desktop e mobile). Mantenha os textos de
`src/config/content.ts` curtos. Exceções intencionais: a Política de Privacidade (texto jurídico) e o painel administrativo.

## Pré-visualização privada

Enquanto houver veículos fictícios, o site não deve ser público nem indexado:

- `VITE_ALLOW_INDEXING` diferente de `true` ⇒ `noindex` em todas as páginas e `robots.txt` bloqueando rastreadores (padrão).
- Na Vercel, ative **Settings → Deployment Protection → Vercel Authentication** (ou *Password Protection*) para exigir
  login/senha de quem acessar o link durante a apresentação.

## Financiamento (`/financiamento`)

- **Interface completa:** ficha em 4 etapas (dados pessoais, endereço, dados profissionais, veículo e financiamento),
  indicador de progresso, máscaras, validação acessível, consentimento e veículo pré-selecionado via
  `/financiamento?veiculo=<slug>` (o parâmetro só identifica o veículo; os dados vêm do catálogo). `/Financiamento`
  redireciona para a nova rota.
- **Envio: NÃO operacional por padrão.** Só envia se `VITE_FINANCING_ENDPOINT` apontar para um backend HTTPS autorizado.
  Sem ele, o botão mostra "Envio online indisponível — seus dados não foram enviados nem armazenados" e oferece WhatsApp
  apenas com o nome do veículo. Nada vai para `localStorage`, URL, analytics, console ou WhatsApp.
- **Minimização:** CPF, RG, CNH, data de nascimento, filiação, tipo/tempo de residência e tempo de emprego existem no
  registro de campos, mas estão desligados em `FINANCING_FLAGS` (`src/lib/financing.ts`) até validação da SAAB/jurídico.
- **Para ativar:** backend com validação no servidor, HTTPS, autenticação administrativa, antiabuso, política de retenção,
  base legal definida (LGPD) e revisão do texto da Política de Privacidade (seção "Ficha de financiamento").

## Pendências do cliente (interno)

Itens provisórios — nada disso aparece como aviso na interface; blocos sem dado confirmado ficam ocultos:

| Item | Onde preencher | Situação na interface |
| --- | --- | --- |
| Estoque real (veículos e fotos) | Painel `/admin` (Supabase) | 12 veículos fictícios com fotos de referência |
| WhatsApp | `VITE_WHATSAPP_NUMBER` / `site.ts` | Link abre o WhatsApp sem destinatário fixo |
| Endereço | `src/config/site.ts` | Confirmado: Av. Joaquim Constantino, nº 1868 — Vila Formosa (CEP não informado) |
| Horários, telefone, e-mail | `src/config/site.ts` | Ocultos até confirmação |
| Logotipo oficial e tom exato de azul | `site.ts` (`logo`) e `index.css` (`--color-brand*`) | Logotipo tipográfico + `#1254B8` |
| História e propósito | `content.aboutPage.history/purpose` | Blocos ocultos |
| Diferenciais (página Sobre) | `content.differentials` | Textos genéricos a validar |
| Fotos da fachada/equipe | `content.about.image`, `content.aboutPage.gallery` | Painel com a marca |
| Fotos do estoque real (substituem as de terceiros e dispensam atribuição) | Painel `/admin` | Fotos CC BY-SA com atribuição em `/informacoes-legais` |
| Backend da ficha de financiamento | `VITE_FINANCING_ENDPOINT` | Somente interface; envio desativado |
| Revisão jurídica da Política de Privacidade | `src/pages/PrivacyPage.tsx` | Minuta |
| Avaliações reais | `src/data/reviews.ts` | Seção oculta |
