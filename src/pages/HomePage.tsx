import { env } from '@/config/env'
import { useSeo } from '@/lib/seo'
import { STATIC_PAGES, dealerJsonLd } from '@/lib/seo-meta'
import { AboutPreview } from '@/components/home/AboutPreview'
import { Differentials } from '@/components/home/Differentials'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { Hero } from '@/components/home/Hero'
import { LocationContact } from '@/components/home/LocationContact'
import { Services } from '@/components/home/Services'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  useSeo({ ...STATIC_PAGES['/'], path: '/', jsonLd: dealerJsonLd(env.siteUrl || window.location.origin) })
  return (
    <>
      <Hero />
      <FeaturedVehicles />
      <Differentials />
      <Services />
      <AboutPreview />
      <Testimonials />
      <LocationContact />
    </>
  )
}
