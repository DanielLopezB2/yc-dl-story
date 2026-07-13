import { useCallback, useRef, useState } from 'react'
import { GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_SCOPE } from '../lib/config'
import {
  createTokenClient,
  ensureAlbumFolder,
  fetchPhotoBlobUrl,
  listPhotos,
  loadGoogleIdentityServices,
  uploadPhoto,
  type DrivePhoto,
} from '../lib/googleDrive'

export interface AlbumPhoto extends DrivePhoto {
  imageUrl: string
}

interface TokenClient {
  requestAccessToken: (opts?: { prompt?: string }) => void
}

export function useGoogleDrive() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<AlbumPhoto[]>([])

  const tokenRef = useRef<string | null>(null)
  const folderIdRef = useRef<string | null>(null)
  const tokenClientRef = useRef<TokenClient | null>(null)

  const loadPhotos = useCallback(async (token: string, folderId: string) => {
    const list = await listPhotos(token, folderId)
    const withUrls = await Promise.all(
      list.map(async (photo) => ({ ...photo, imageUrl: await fetchPhotoBlobUrl(token, photo.id) })),
    )
    setPhotos(withUrls)
  }, [])

  const handleToken = useCallback(
    async (token: string) => {
      tokenRef.current = token
      setIsSignedIn(true)
      setIsLoading(true)
      setError(null)
      try {
        const folderId = await ensureAlbumFolder(token)
        folderIdRef.current = folderId
        await loadPhotos(token, folderId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al conectar con Google Drive')
      } finally {
        setIsLoading(false)
      }
    },
    [loadPhotos],
  )

  const signIn = useCallback(async () => {
    setError(null)
    if (!GOOGLE_DRIVE_CLIENT_ID) {
      setError('Falta configurar el Client ID de Google Drive en config.ts.')
      return
    }
    try {
      await loadGoogleIdentityServices()
      if (!tokenClientRef.current) {
        tokenClientRef.current = createTokenClient(
          GOOGLE_DRIVE_CLIENT_ID,
          GOOGLE_DRIVE_SCOPE,
          (token) => void handleToken(token),
          (message) => setError(message),
        )
      }
      tokenClientRef.current.requestAccessToken()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar Google Identity Services')
    }
  }, [handleToken])

  const upload = useCallback(
    async (file: File, caption: string, date: string) => {
      if (!tokenRef.current || !folderIdRef.current) return
      setIsLoading(true)
      setError(null)
      try {
        await uploadPhoto(tokenRef.current, { file, caption, date, folderId: folderIdRef.current })
        await loadPhotos(tokenRef.current, folderIdRef.current)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir la foto')
      } finally {
        setIsLoading(false)
      }
    },
    [loadPhotos],
  )

  return { isSignedIn, isLoading, error, photos, signIn, upload }
}
