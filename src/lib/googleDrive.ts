import { ALBUM_FOLDER_NAME } from './config'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: string }) => void
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void }
        }
      }
    }
  }
}

const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files'
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files'

let gisLoadPromise: Promise<void> | null = null

export function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (gisLoadPromise) return gisLoadPromise

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'))
    document.head.appendChild(script)
  })

  return gisLoadPromise
}

export function createTokenClient(
  clientId: string,
  scope: string,
  onToken: (token: string) => void,
  onError: (message: string) => void,
) {
  if (!window.google) throw new Error('Google Identity Services no está cargado')
  return window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope,
    callback: (response) => {
      if (response.error || !response.access_token) {
        onError(response.error ?? 'No se recibió un token de acceso')
        return
      }
      onToken(response.access_token)
    },
  })
}

async function driveFetch(token: string, url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Drive respondió ${res.status}: ${body}`)
  }
  return res
}

export async function ensureAlbumFolder(token: string): Promise<string> {
  const q = encodeURIComponent(
    `name='${ALBUM_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  )
  const res = await driveFetch(token, `${DRIVE_FILES_URL}?q=${q}&fields=files(id,name)`)
  const data = (await res.json()) as { files?: { id: string }[] }
  if (data.files?.[0]) return data.files[0].id

  const createRes = await driveFetch(token, DRIVE_FILES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: ALBUM_FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  })
  const created = (await createRes.json()) as { id: string }
  return created.id
}

export interface DrivePhoto {
  id: string
  caption: string
  date: string
  createdTime: string
}

export async function listPhotos(token: string, folderId: string): Promise<DrivePhoto[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`)
  const res = await driveFetch(
    token,
    `${DRIVE_FILES_URL}?q=${q}&fields=files(id,appProperties,createdTime)&orderBy=createdTime desc&pageSize=1000`,
  )
  const data = (await res.json()) as {
    files?: { id: string; appProperties?: { caption?: string; date?: string }; createdTime: string }[]
  }
  return (data.files ?? []).map((file) => ({
    id: file.id,
    caption: file.appProperties?.caption ?? '',
    date: file.appProperties?.date ?? file.createdTime.slice(0, 10),
    createdTime: file.createdTime,
  }))
}

export async function uploadPhoto(
  token: string,
  { file, caption, date, folderId }: { file: File; caption: string; date: string; folderId: string },
): Promise<DrivePhoto> {
  const metadata = {
    name: file.name,
    parents: [folderId],
    appProperties: { caption, date },
  }
  const boundary = 'nuestro-comienzo-boundary'
  const head =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${file.type}\r\n\r\n`
  const tail = `\r\n--${boundary}--`

  const body = new Blob([head, await file.arrayBuffer(), tail])

  const res = await driveFetch(
    token,
    `${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,appProperties,createdTime`,
    {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    },
  )
  const created = (await res.json()) as {
    id: string
    appProperties?: { caption?: string; date?: string }
    createdTime: string
  }
  return {
    id: created.id,
    caption: created.appProperties?.caption ?? caption,
    date: created.appProperties?.date ?? date,
    createdTime: created.createdTime,
  }
}

export async function fetchPhotoBlobUrl(token: string, fileId: string): Promise<string> {
  const res = await driveFetch(token, `${DRIVE_FILES_URL}/${fileId}?alt=media`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function updatePhotoMeta(
  token: string,
  fileId: string,
  { caption, date }: { caption: string; date: string },
): Promise<void> {
  await driveFetch(token, `${DRIVE_FILES_URL}/${fileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appProperties: { caption, date } }),
  })
}

export async function trashPhoto(token: string, fileId: string): Promise<void> {
  await driveFetch(token, `${DRIVE_FILES_URL}/${fileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  })
}
