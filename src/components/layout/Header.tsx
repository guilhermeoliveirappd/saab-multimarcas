import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Logo } from './Logo'

export function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const overHero = pathname === '/' && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha o menu ao trocar de rota
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-500',
        overHero ? 'border-b border-transparent bg-transparent' : 'border-b border-ink-100 bg-white/90 backdrop-blur-xl',
        pathname === '/' && '-mb-[72px] lg:-mb-20',
      )}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-20">
        <Link to="/" className="shrink-0 rounded-lg" aria-label={`${siteConfig.name} — página inicial`}>
          <Logo tone={overHero ? 'light' : 'dark'} />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      overHero ? 'text-white/80 hover:text-white' : 'text-ink-600 hover:text-ink-950',
                      isActive && (overHero ? 'text-white' : 'text-ink-950'),
                      isActive && 'after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <WhatsAppButton location="header" size="md" />
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            className={cn(
              'grid size-11 place-items-center rounded-full transition-colors lg:hidden',
              overHero ? 'text-white hover:bg-white/10' : 'text-ink-900 hover:bg-ink-100',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-[72px] bottom-0 z-40 flex flex-col bg-white transition-[opacity,visibility] duration-300 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Menu mobile" className="container-site flex-1 overflow-y-auto py-6">
          <ul className="divide-y divide-ink-100">
            {mainNav.map((item, i) => (
              <li key={item.to} style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }} className={cn('transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn('flex items-center justify-between py-4 font-display text-2xl font-bold', isActive ? 'text-accent' : 'text-ink-950')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-site space-y-3 border-t border-ink-100 py-6">
          <WhatsAppButton location="mobile_menu" size="lg" className="w-full" />
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-ink-600">
            <InstagramIcon size={18} /> {siteConfig.social.instagramHandle}
          </a>
        </div>
      </div>
    </header>
  )
}
