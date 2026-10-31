import { Handshake, MapPin, MessagesSquare, Search, type LucideIcon } from 'lucide-react'
import { content } from '@/config/content'
import { SectionHeading } from '@/components/ui/SectionHeading'

const ICONS: Record<string, LucideIcon> = { messages: MessagesSquare, search: Search, handshake: Handshake, map: MapPin }

export function Differentials() {
  const d = content.differentials
  // Oculto até a empresa validar os diferenciais (content.differentials.enabled)
  if (!d.enabled) return null
  return (
    <section aria-labelledby="diff-title" className="relative isolate overflow-hidden bg-brand-deep py-20 text-white lg:py-24">
      <div className="absolute -top-40 left-1/2 -z-10 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-brand/35 blur-3xl" aria-hidden="true" />
      <div className="container-site">
        <SectionHeading id="diff-title" tone="dark" title={d.title} className="mb-10 lg:mb-12" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {d.items.map((item) => {
            const Icon = ICONS[item.icon] ?? Search
            return (
              <li
                key={item.title}
                className="group flex flex-col items-center rounded-[var(--radius-card)] bg-white/[0.06] p-7 text-center ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.1] lg:p-8"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand shadow-[0_12px_30px_-14px_rgba(0,0,0,.6)] transition-transform duration-500 group-hover:-translate-y-0.5">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-balance text-white/80">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
