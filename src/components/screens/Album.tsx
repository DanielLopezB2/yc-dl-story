import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
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

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${MONTH_LABELS[(month ?? 1) - 1]} ${year}`
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
                  <motion.figure
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-md"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Foto de nuestro álbum'}
                      className="aspect-square w-full object-cover"
                    />
                    {photo.caption && (
                      <figcaption className="px-3 py-2 font-body text-xs text-text-secondary">
                        {photo.caption}
                      </figcaption>
                    )}
                  </motion.figure>
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
    </section>
  )
}
