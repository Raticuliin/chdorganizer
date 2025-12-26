export type FileEntry = {
  name: string
  isDirectory: boolean
  // "unknown" porque aqui guardamos el handle o string path
  nativeHandle: unknown
  // Opcional porque en web puede que no se use
  path?: string
}

export type FolderContent = {
  rootPath: string //Nombre de la carpeta
  files: FileEntry[] // Lista de archivos
}

export type GameGroup = {
  gameName: string
  files: FileEntry[]
  needsM3u: boolean
}
