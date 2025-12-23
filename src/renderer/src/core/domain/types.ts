export type FileEntry = {
  name: string
  isDirectory: boolean
  // "unknown" porque aqui guardamos el handle o string path
  nativeHandle: unknown
  // Opcional porque en web puede que no se use
  path?: string
}

export type FolderContent = {
  rootName: string //Nombre de la carpeta
  files: FileEntry[] // Lista de archivos
}
