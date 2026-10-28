import { fireEvent, render, screen } from '@testing-library/react'
import { demoVehicles } from '@/data/demo-vehicles'
import { Photo } from './Photo'

describe('Photo', () => {
  it('swaps to the local fallback when the remote photo fails', () => {
    render(<Photo image={{ url: 'https://example.com/x.jpg', srcSet: 'https://example.com/x.jpg 960w', fallbackUrl: '/demo/x.svg', alt: 'Carro' }} />)
    const img = screen.getByAltText('Carro')
    expect(img).toHaveAttribute('src', 'https://example.com/x.jpg')
    fireEvent.error(img)
    expect(screen.getByAltText('Carro')).toHaveAttribute('src', '/demo/x.svg')
    expect(screen.getByAltText('Carro')).not.toHaveAttribute('srcset')
  })

  it('gives every example vehicle a credited photo with a local fallback', () => {
    for (const v of demoVehicles) {
      const [cover] = v.images
      expect(cover.url).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//)
      expect(cover.fallbackUrl).toBe(`/demo/vehicles/${v.slug}-1.svg`)
      expect(cover.credit?.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
    }
  })
})
