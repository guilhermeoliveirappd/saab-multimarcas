export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export const slugify = (value: string): string =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const buildVehicleSlug = (v: { brand: string; model: string; version: string; yearModel: number }): string => {
  const firstVersionWord = v.version.split(/\s+/)[0] ?? ''
  return slugify(`${v.brand} ${v.model} ${firstVersionWord} ${v.yearModel}`)
}
