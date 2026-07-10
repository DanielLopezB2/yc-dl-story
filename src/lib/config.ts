export interface Clue {
  id: number
  place: string
  object: string
  detail?: string
  code: string
}

export const START_DATE = '2026-01-21'

export const YOUTUBE_VIDEO_ID = 'gV4yxZSBtac'

export const CLUES: Clue[] = [
  { id: 1, place: 'Cocina', object: 'Donde están las proteínas', code: 'AMOR1' },
  { id: 2, place: 'Mesa de noche', object: 'Carta', code: 'AMOR2' },
  { id: 3, place: 'Closet', object: 'Ramo pequeño', code: 'AMOR3' },
  { id: 4, place: 'Escritorio', object: 'Caja', code: 'AMOR4' },
  { id: 5, place: 'Cocina', object: 'Dulce', code: 'AMOR5' },
  {
    id: 6,
    place: 'Hanashi',
    object: 'Carta final',
    detail: 'Ak 7 #58-42, Bogotá — 4:00 p.m.',
    code: 'AMOR6',
  },
]

export const REASONS: string[] = [
  'Porque contigo puedo ser quien realmente soy.',
  'Porque haces especiales los días comunes.',
  'Porque admiro tu forma de ver la vida.',
  'Porque tu sonrisa alegra mis días.',
  'Porque me inspiras a crecer.',
  'Porque disfruto cada conversación.',
  'Porque cualquier lugar contigo se siente como hogar.',
  'Porque confío plenamente en ti.',
  'Porque compartimos sueños.',
  'Porque incluso el silencio contigo es bonito.',
  'Porque quiero construir mi futuro contigo.',
]

export const TENDER_PHRASES: string[] = [
  'Necesito un abrazo tuyo antes de seguir.',
  'Ven un segundo, solo eso, y después seguimos.',
  'Todavía no... primero abrázame fuerte.',
  'Espera, déjame sentir tus brazos antes de continuar.',
  'Un abrazo tuyo y prometo seguir.',
  'Necesito estar cerca tuyo un momento antes de esto.',
  'Solo quiero un abrazo tuyo primero, después vamos.',
  'Antes de seguir, quiero sentirte cerca.',
]
