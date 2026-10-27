import type { ReactNode } from 'react'
import { isSupabaseConfigured } from '@/config/env'
import { siteConfig } from '@/config/site'
import { analyticsEnabled } from '@/lib/analytics'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES } from '@/lib/seo-meta'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProvisionalBadge } from '@/components/ui/ProvisionalBadge'

/**
 * Política de Privacidade — MINUTA editável.
 * As seções se ajustam às integrações realmente ativas (GA4/GTM, mapa, Supabase).
 * Recomenda-se revisão jurídica antes da publicação definitiva.
 */
const LAST_UPDATE = '27/10/2026'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold text-ink-950">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  useSeo({ ...STATIC_PAGES['/politica-de-privacidade'], path: '/politica-de-privacidade' })
  const controller = siteConfig.legalName ?? siteConfig.name
  const hasMap = siteConfig.address.confirmed && Boolean(siteConfig.address.mapsEmbedUrl)

  return (
    <>
      <PageHeader
        title="Política de Privacidade"
        description={`Última atualização: ${LAST_UPDATE}`}
        breadcrumb={[{ label: 'Política de Privacidade' }]}
        badge={<ProvisionalBadge label="Minuta — revisão jurídica pendente" />}
      />
      <article className="container-site max-w-3xl py-12 lg:py-16">
        <p className="leading-relaxed text-ink-600">
          Esta política explica como {controller}
          {siteConfig.cnpj && `, inscrita no CNPJ ${siteConfig.cnpj},`} trata dados pessoais neste site, em conformidade com a Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018 — LGPD).
        </p>

        <Section title="1. Dados que coletamos">
          <p>
            Este site <strong>não possui cadastro de visitantes</strong> e não armazena dados preenchidos em formulários. No formulário de
            venda ou troca, as informações do veículo são apenas inseridas em uma mensagem do WhatsApp, que você revisa e decide enviar.
          </p>
          {analyticsEnabled ? (
            <p>
              Com o seu consentimento, utilizamos ferramentas de mensuração do Google (Google Analytics 4 e/ou Google Tag Manager) que coletam
              dados de navegação de forma agregada, como páginas visitadas, cliques em botões de contato, tipo de dispositivo e localização
              aproximada.
            </p>
          ) : (
            <p>No momento, não utilizamos ferramentas de mensuração ou publicidade de terceiros.</p>
          )}
          <p>
            Nosso provedor de hospedagem pode registrar dados técnicos de acesso (como endereço IP, data e hora) para fins de segurança e
            funcionamento do serviço.
          </p>
        </Section>

        <Section title="2. Contato pelo WhatsApp e Instagram">
          <p>
            Ao clicar em um botão de WhatsApp ou Instagram, você é direcionado a serviços da Meta Platforms. A conversa iniciada nesses canais
            segue também as políticas de privacidade desses serviços. Utilizamos os dados que você nos envia por esses canais apenas para
            responder ao seu contato e conduzir a negociação solicitada.
          </p>
        </Section>

        {hasMap && (
          <Section title="3. Mapa">
            <p>A página de localização exibe um mapa do Google Maps, que pode coletar dados conforme a política de privacidade do Google.</p>
          </Section>
        )}

        <Section title={`${hasMap ? 4 : 3}. Cookies e armazenamento local`}>
          {analyticsEnabled ? (
            <p>
              Cookies de mensuração só são ativados após você clicar em “Aceitar” no aviso de cookies. Sua escolha fica salva no armazenamento
              local do navegador e pode ser revogada limpando os dados do site no navegador.
            </p>
          ) : (
            <p>Este site não utiliza cookies de rastreamento.</p>
          )}
          {isSupabaseConfigured && <p>A área administrativa, restrita à equipe da loja, utiliza armazenamento local para manter a sessão de login.</p>}
        </Section>

        <Section title={`${hasMap ? 5 : 4}. Seus direitos`}>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação de dados pessoais, bem
            como revogar consentimentos, conforme o art. 18 da LGPD.
          </p>
          <p>
            Para exercer seus direitos, entre em contato pelos canais informados na página de Contato
            {siteConfig.email && ` ou pelo e-mail ${siteConfig.email}`}.
          </p>
        </Section>

        <Section title={`${hasMap ? 6 : 5}. Alterações`}>
          <p>Esta política pode ser atualizada a qualquer momento. A data da última atualização está indicada no topo da página.</p>
        </Section>
      </article>
    </>
  )
}
