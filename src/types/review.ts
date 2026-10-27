/**
 * Avaliação real e verificável de cliente. Não cadastre avaliações sem
 * origem comprovável (ex.: link público do Google).
 */
export interface Review {
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  date: string
  source: 'google' | 'instagram' | 'outro'
  sourceUrl: string
}
