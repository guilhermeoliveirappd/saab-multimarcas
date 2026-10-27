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
          eyebrow={d.eyebrow}
          title={d.title}
          description={d.description}
          badge={d.provisional && <ProvisionalBadge tone="dark" />}
          className="mb-14"
        />
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {d.items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Search
            return (
              <li key={item.title} className="group bg-ink-950 p-7 transition-colors duration-500 hover:bg-ink-900 lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 transition-colors duration-500 group-hover:bg-accent group-hover:ring-accent">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm text-ink-500">0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
