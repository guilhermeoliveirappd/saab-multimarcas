import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import type { ReactElement } from 'react'
import { VehiclesProvider } from '@/hooks/VehiclesProvider'

export function renderRoute(ui: ReactElement, { path = '/', route = '/' }: { path?: string; route?: string } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <VehiclesProvider>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </VehiclesProvider>
    </MemoryRouter>,
  )
}
