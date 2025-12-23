import { IFileSystem } from '../gateways/IFileSystem'
import { FileEntry, FolderContent } from '../domain/types'

export class WebFileSystemAdapter implements IFileSystem {
  async selectAndReadFolder(): Promise<FolderContent | null> {
    try {
      // Solicitamos al navegador que abra el selector de carpetas
      const dirHandle = await window.showDirectoryPicker({
        id: 'chdorganizer_start',
        mode: 'read'
      })

      const files: FileEntry[] = []

      // Iteramos sobre el contenido
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' || entry.kind === 'directory') {
          files.push({
            name: entry.name,
            isDirectory: entry.kind == 'directory',
            nativeHandle: entry,
            path: undefined
          })
        }
      }

      // Ordenamos alfabeticamente
      files.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true
        })
      )

      return {
        rootName: dirHandle.name,
        files: files
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null
      }

      console.log('Error on the file access: ', error)
      throw error
    }
  }
}
