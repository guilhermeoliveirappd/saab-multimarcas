import { Handshake, MapPin, MessagesSquare, Search, type LucideIcon } from 'lucide-react'
import { content } from '@/config/content'
import { ProvisionalBadge } from '@/components/ui/ProvisionalBadge'
import { SectionHeading } from '@/components/ui/SectionHeading'

const ICONS: Record<string, LucideIcon> = { messages: MessagesSquare, search: Search, handshake: Handshake, map: MapPin }

export function Differentials() {
  const d = content.differentials
  return (
    <section aria-labelledby="diff-title" className="bg-ink-950 py-20 text-white lg:py-28">
      <div className="container-site">
        <SectionHeading
          id="diff-title"
          tone="dark"
          title={d.title}
          description={d.description}
          badge={d.provisional && <ProvisionalBadge tone="dark" />}
          className="mb-14"
        />
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {d.items.map((item) => {
            const Icon = ICONS[item.icon] ?? Search
            return (
              <li key={item.title} className="group flex flex-col items-center bg-ink-950 p-7 text-center transition-colors duration-500 hover:bg-ink-900 lg:p-8">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-white shadow-[0_10px_30px_-12px_var(--color-accent)] transition-transform duration-500 group-hover:-translate-y-0.5">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-balance text-ink-300">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
