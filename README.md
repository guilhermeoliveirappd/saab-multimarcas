# Robcar Veículos — Website

Website institucional + catálogo digital de veículos da **Robcar Veículos** (Osvaldo Cruz/SP).
Desenvolvido por **NESX Performance & Growth**.

> 🔒 **Documentação interna — apresentação privada.** Sem estoque real cadastrado, o catálogo exibe veículos de
> **exemplo** (fotos de referência de terceiros) — **não são o estoque da Robcar**. A interface não exibe avisos de
> demonstração; mantenha o link protegido (ver "Pré-visualização privada") até a validação.
>
> Histórico: este repositório foi migrado a partir de um projeto anterior. A versão anterior está preservada na branch
> `backup/saab-multimarcas-v8` e **não compartilha dados, credenciais nem ambiente** com a Robcar.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · Lucide · Supabase (opcional) · Vercel.
Tipografia: Plus Jakarta Sans (títulos) + DM Sans (textos), auto-hospedadas.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run build` | Typecheck + build + pré-renderização (meta tags por rota, sitemap, robots) |
| `npm run lint` / `npm test` | ESLint / Vitest |
| `npm run photos:estoque` | Otimiza fotos de `fotos-originais/<slug>/` → `public/estoque/<slug>/` |
| `npm run photos:fachada -- <arquivo>` | Gera `public/media/fachada-robcar-{800,1600}.webp` |

## Onde editar

| O quê | Arquivo |
| --- | --- |
| **Dados da empresa** (nome, telefones, WhatsApp, Instagram, endereço, mapa) | `src/config/brand.ts` |
| Serviços ativos, SEO, catálogo | `src/config/site.ts` |
| Textos (headline, seções, páginas) | `src/config/content.ts` |
| Cores da marca | `src/styles/index.css` → `--brand-primary` (provisório `#B91C1C`) |
| **Estoque real** | `src/data/robcar-stock.ts` |
| Foto do banner | `src/data/stock-photos.ts` (`HERO_PHOTO`) |
| Logotipo oficial (quando existir) | `siteConfig.logo` em `src/config/site.ts` |

### Identidade visual (provisória)

- Vermelho como cor de ação, grafite/preto nas áreas de contraste, branco e cinzas neutros (inspirado na fachada).
- **A Robcar não possui logotipo oficial.** O site usa o wordmark tipográfico provisório "ROBCAR VEÍCULOS"
  (`src/components/layout/Logo.tsx`) e favicon provisório — não apresentar como logotipo oficial.

## Estoque real — como cadastrar

1. Coloque as fotos originais de cada carro em `fotos-originais/<slug>/` (pasta fora do git).
2. Rode `npm run photos:estoque` — gera WebP 640/1280, remove EXIF/GPS e imprime os nomes para `imagens`.
3. Cadastre o carro em `src/data/robcar-stock.ts` **exatamente** com os dados recebidos (`marca`, `modelo`, `versao`,
   `anoFabricacao`, `anoModelo`, `preco`, `quilometragem`, `cambio`, `combustivel`, `cor`, `opcionais[]`, `descricao`,
   `imagens[]`, `status`, `destaque`). Nada estimado.
4. Com ao menos 1 veículo real cadastrado, o site exibe **somente** o estoque real (os exemplos saem automaticamente).

Galeria: miniaturas, anterior/próxima, teclado, swipe e ampliação. Fotos que falharem são removidas da galeria; nunca
repita a mesma foto nem use foto de outro carro.

## Configuração atual

| Item | Situação |
| --- | --- |
| Endereço | Rua Armando Sales, nº 487 — Centro — Osvaldo Cruz/SP (rota e mapa gerados do texto) |
| Telefones | (18) 3528-1773 · (18) 99784-1331 |
| WhatsApp | `5518997841331` (celular — **confirmar que recebe WhatsApp**) |
| Instagram | https://www.instagram.com/robcar__veiculos/ |
| Serviços ativos | Venda de veículos do estoque. **Venda/troca do veículo do cliente e financiamento: desligados** até confirmação (`siteConfig.services`) — páginas, menu e CTAs ficam ocultos. |
| "Por que escolher a Robcar" (Sobre Nós) | Desligado até validação (`content.differentials.enabled`) |
| Banner | Foto de carro vermelho (Pexels, sem atribuição obrigatória) com alternativas e fallback local |

## Pendências do cliente (interno)

| Item | Onde preencher |
| --- | --- |
| Fotos e textos reais dos veículos | `fotos-originais/` + `src/data/robcar-stock.ts` |
| Foto real da fachada vermelha | `npm run photos:fachada` + `content.location.facade` |
| **Grafia da rua: "Armando Sales" (briefing) × "Armando Salles" (fontes públicas)** e conferência do pino no mapa | `src/config/brand.ts` |
| Confirmar WhatsApp no celular | `brand.whatsappNumber` |
| Horário de funcionamento, CNPJ, razão social, e-mail | `brand.ts` / `site.ts` (blocos ocultos enquanto `null`) |
| Serviços: compra/troca do carro do cliente e financiamento | `siteConfig.services` |
| Diferenciais, história e propósito da empresa | `content.differentials`, `content.aboutPage` |
| Tom exato de vermelho (após ver a fachada) e logotipo oficial, se vier a existir | `index.css`, `siteConfig.logo` |
| Revisão jurídica da Política de Privacidade | `src/pages/PrivacyPage.tsx` |

## Financiamento (`/financiamento`)

Rota e ficha em 4 etapas **preparadas, mas desligadas** (`siteConfig.services.financing = false`) até a Robcar
confirmar o serviço. Mesmo ativada, só envia dados com `VITE_FINANCING_ENDPOINT` (backend HTTPS autorizado, validação
no servidor, antiabuso, retenção e base legal LGPD definidas). Sem backend: nenhum dado é enviado ou armazenado.
Campos sensíveis (CPF, RG, CNH etc.) desligados em `FINANCING_FLAGS`. Nenhum dado de outro projeto foi migrado.

## Isolamento de dados

- O site **não está conectado a nenhum banco** (sem `VITE_SUPABASE_*`). Para o painel `/admin`, crie um projeto
  Supabase **exclusivo da Robcar** e rode `supabase/migrations/`. Nunca reutilize banco, usuários ou chaves de outro cliente.
- Nenhum segredo no frontend (`VITE_*` são públicas; use apenas a chave anon).
- Chave de consentimento de analytics própria (`robcar-analytics-consent`).

## Imagens (registro de origem e licença)

| Uso | Origem | Licença | Atribuição |
| --- | --- | --- | --- |
| Banner | Pexels 14609318 (alternativas 3729464, 17075639) | Licença Pexels | Não obrigatória |
| Veículos de exemplo | Wikimedia Commons — séries de Damian B Oh (`src/data/stock-photos.ts`) | CC BY-SA 4.0 | Em `/informacoes-legais` |

O ambiente de desenvolvimento não acessa Pexels/Wikimedia — confira as fotos no link publicado.

## SEO

Pré-renderização de metadados por rota no build (`scripts/prerender.ts`), sitemap e robots. Defina
`VITE_SITE_URL` (ex.: `https://robcar-veiculos.vercel.app`). Com `VITE_ALLOW_INDEXING != true`, tudo fica `noindex`.
Veículos de exemplo nunca entram no sitemap nem recebem dados estruturados.

## Pré-visualização privada

- `VITE_ALLOW_INDEXING` ≠ `true` (padrão) ⇒ `noindex` + `robots.txt` bloqueando rastreadores.
- Vercel → **Settings → Deployment Protection** (Vercel Authentication ou senha) durante a apresentação.

## Vercel — endereço do projeto (PENDENTE, fazer no painel)

O ambiente de desenvolvimento não tem acesso à Vercel; nada foi alterado lá. Passos:

1. Confirme o projeto ligado a este repositório (provavelmente `saab-multimarcas`), a equipe e os domínios.
2. A versão anterior está preservada na branch `backup/saab-multimarcas-v8`.
3. **Settings → General → Project Name**: `robcar-veiculos` (se ocupado: `robcar-osvaldocruz` ou `robcar-veiculos-oc`).
4. **Settings → Domains**: confirme o domínio `.vercel.app` gerado; remova domínios antigos que não sejam da Robcar
   (não redirecione domínios de terceiros).
5. **Settings → Environment Variables**: `VITE_SITE_URL=https://<novo-endereço>` e redeploy.
6. Teste: navegação, imagens, WhatsApp (`wa.me/5518997841331`), telefones, rota do mapa, `/sitemap.xml`, Open Graph.
7. Opcional: renomear o repositório GitHub para `robcar-veiculos` (Settings → General) e reconectar na Vercel se preciso.
