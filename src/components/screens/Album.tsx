import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGoogleDrive, type AlbumPhoto } from '../../hooks/useGoogleDrive'

interface AlbumProps {
  onBack: () => void
}

const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${MONTH_LABELS[(month ?? 1) - 1]} ${year}`
}

function shortDate(dateStr: string): string {
  return parseDateOnly(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function fullDate(dateStr: string): string {
  return parseDateOnly(dateStr).toLocaleDateString('es-ES', { dateStyle: 'long' })
}

function truncateCaption(caption: string): string {
  const words = caption.trim().split(/\s+/)
  if (words.length <= 5) return caption
  return `${words.slice(0, 5).join(' ')}...`
}

function groupByMonth(photos: AlbumPhoto[]): [string, AlbumPhoto[]][] {
  const map = new Map<string, AlbumPhoto[]>()
  for (const photo of photos) {
    const key = photo.date.slice(0, 7)
    const bucket = map.get(key) ?? []
    bucket.push(photo)
    map.set(key, bucket)
  }
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

export default function Album({ onBack }: AlbumProps) {
  const { isSignedIn, isLoading, error, photos, signIn, upload } = useGoogleDrive()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedPhoto, setSelectedPhoto] = useState<AlbumPhoto | null>(null)

  const grouped = useMemo(() => groupByMonth(photos), [photos])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return
    await upload(file, caption, date)
    setFile(null)
    setCaption('')
  }

  return (
    <section className="flex min-h-screen flex-col items-center gap-8 bg-background px-6 py-16 text-center">
      <h2 className="font-heading text-4xl text-text">Nuestro Álbum</h2>

      {!isSignedIn ? (
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-md font-body text-text-secondary">
            Conectate con Google Drive para empezar a guardar nuestras fotos.
          </p>
          <button
            type="button"
            onClick={signIn}
            className="rounded-full bg-primary px-8 py-3 font-body font-semibold text-white shadow-lg shadow-primary/30"
          >
            Conectar con Google Drive
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            aria-label="Elegir foto"
            className="font-body text-sm text-text-secondary"
          />
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Caption"
            aria-label="Caption de la foto"
            className="rounded-full border border-primary/40 bg-white px-5 py-3 font-body text-text outline-none focus-visible:border-gold"
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="Fecha de la foto"
            className="rounded-full border border-primary/40 bg-white px-5 py-3 font-body text-text outline-none focus-visible:border-gold"
          />
          <button
            type="submit"
            disabled={!file || isLoading}
            className="rounded-full bg-primary px-8 py-3 font-body font-semibold text-white transition-opacity duration-300 disabled:opacity-40"
          >
            {isLoading ? 'Subiendo…' : 'Subir foto'}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="max-w-md font-body text-sm text-primary">
          {error}
        </p>
      )}

      {grouped.length > 0 && (
        <div className="flex w-full max-w-3xl flex-col gap-10">
          {grouped.map(([month, monthPhotos]) => (
            <div key={month} className="flex flex-col gap-4">
              <h3 className="font-subheading text-lg text-text">{monthLabel(month)}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {monthPhotos.map((photo) => (
                  <motion.button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    aria-label={`Ver foto${photo.caption ? `: ${photo.caption}` : ''}`}
                    className="flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-md ring-1 ring-primary/10 transition-shadow duration-300 hover:shadow-xl"
                  >
                    <span className="px-3 pt-3 font-body text-[0.7rem] uppercase tracking-wide text-text-secondary">
                      {shortDate(photo.date)}
                    </span>
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Foto de nuestro álbum'}
                      className="mt-2 aspect-square w-full object-cover"
                    />
                    {photo.caption && (
                      <span className="px-3 py-2 font-body text-xs text-text-secondary">
                        {truncateCaption(photo.caption)}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="font-body text-sm text-text-secondary underline underline-offset-4"
      >
        Volver
      </button>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-text/80 px-6 py-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white text-center shadow-2xl"
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || 'Foto de nuestro álbum'}
                className="max-h-[60vh] w-full object-contain bg-background"
              />
              <div className="flex flex-col gap-2 px-6 py-5">
                <span className="font-subheading text-sm text-primary">{fullDate(selectedPhoto.date)}</span>
                {selectedPhoto.caption && (
                  <p className="font-body text-text-secondary">{selectedPhoto.caption}</p>
                )}
              </div>
            </motion.div>

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="rounded-full bg-white px-8 py-3 font-body font-semibold text-text shadow-lg"
            >
              Volver al álbum
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
