import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { demoVehicles } from '@/data/demo-vehicles'
import { STOCK_GALLERIES } from '@/data/stock-photos'
import { VehicleGallery } from './VehicleGallery'

const bmw = demoVehicles.find((v) => v.slug === 'bmw-320i-m-sport-2023')!

describe('VehicleGallery', () => {
  it('navigates between photos with buttons and thumbnails', async () => {
    render(<VehicleGallery images={bmw.images} title="BMW 320i" />)
    const gallery = screen.getByRole('region', { name: 'Fotos de BMW 320i' })
    expect(within(gallery).getByText('1 / 6')).toBeInTheDocument()
    await userEvent.click(within(gallery).getAllByRole('button', { name: 'Próxima foto' })[0])
    expect(within(gallery).getByText('2 / 6')).toBeInTheDocument()
    await userEvent.click(within(gallery).getAllByRole('button', { name: /foto 4/ })[0])
    expect(within(gallery).getByText('4 / 6')).toBeInTheDocument()
  })

  it('drops a photo that fails to load instead of showing a mismatched image', () => {
    render(<VehicleGallery images={bmw.images} title="BMW 320i" />)
    const gallery = screen.getByRole('region', { name: 'Fotos de BMW 320i' })
    fireEvent.error(within(gallery).getAllByRole('img')[0])
    expect(within(gallery).getByText('1 / 5')).toBeInTheDocument()
    expect(within(gallery).getAllByRole('img').every((img) => !img.getAttribute('src')?.endsWith('.svg'))).toBe(true)
  })

  it('opens the enlarged view', async () => {
    render(<VehicleGallery images={bmw.images} title="BMW 320i" />)
    await userEvent.click(screen.getByRole('button', { name: 'Ampliar foto' }))
    expect(screen.getByRole('button', { name: 'Fechar ampliação', hidden: true })).toBeInTheDocument()
  })
})

describe('photo rules', () => {
  it('never repeats a photo inside or across galleries', () => {
    const urls = demoVehicles.flatMap((v) => v.images.map((i) => i.url))
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('builds each gallery from a single source set (same car, same credit)', () => {
    for (const v of demoVehicles) {
      const set = STOCK_GALLERIES[v.slug]
      expect(set, v.slug).toBeDefined()
      expect(v.images).toHaveLength(set.numbers.length)
      expect(v.images.length, v.slug).toBeGreaterThanOrEqual(4)
      expect(new Set(v.images.map((i) => i.credit?.author ?? null)).size).toBe(1)
    }
  })
})
