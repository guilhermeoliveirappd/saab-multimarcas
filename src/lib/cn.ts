/** Junta classes condicionais, ignorando valores falsy. */
export const cn = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(' ')
