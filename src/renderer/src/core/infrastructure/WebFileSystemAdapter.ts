import { IFileSystem } from '../gateways/IFileSystem'
import { FileEntry, FolderContent } from '../domain/types'

interface FileSystemFileHandleWithMove extends FileSystemFileHandle {
  move(destination: FileSystemDirectoryHandle): Promise<void>
}

export class WebFileSystemAdapter implements IFileSystem {
  private rootHandle: FileSystemDirectoryHandle | null = null

  async selectAndReadFolder(): Promise<FolderContent | null> {
    try {
      // Solicitamos al navegador que abra el selector de carpetas
      const handle = await window.showDirectoryPicker({
        id: 'chdorganizer_start',
        mode: 'readwrite'
      })

      this.rootHandle = handle

      const files: FileEntry[] = []

      // Iteramos sobre el contenido
      for await (const entry of handle.values()) {
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
        rootPath: handle.name,
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

  async createDirectory(_parentPath: string, name: string): Promise<void> {
    if (!this.rootHandle) throw new Error('No root handle')

    await this.rootHandle.getDirectoryHandle(name, { create: true })
  }

  async moveFile(file: FileEntry, destPath: string): Promise<void> {
    if (!this.rootHandle) throw new Error('No root handle')

    const fileHandle = file.nativeHandle as FileSystemFileHandle
    const destPathHandle = await this.rootHandle.getDirectoryHandle(destPath)

    if ('move' in fileHandle) {
      const handleWithMove = fileHandle as FileSystemFileHandleWithMove
      await handleWithMove.move(destPathHandle)
      return
    }

    try {
      const newFileHandle = await destPathHandle.getFileHandle(file.name, { create: true })
      const writable = await newFileHandle.createWritable()
      const fileData = await fileHandle.getFile()

      await writable.write(fileData)
      await writable.close()

      // B. Borrar original (Usamos casting seguro para remove)
      if ('remove' in fileHandle) {
        await (fileHandle as unknown as { remove: () => Promise<void> }).remove()
      }
    } catch (error) {
      console.error(`Error moving ${file.name}:`, error)
      throw error
    }
  }

  async writeFile(fileName: string, content: string, subFolderName?: string): Promise<void> {
    if (!this.rootHandle) throw new Error('No root handle')

    try {
      let targetDir = this.rootHandle

      if (subFolderName) {
        console.log(`Buscando carpeta interna: ${subFolderName}`)
        targetDir = await this.rootHandle.getDirectoryHandle(subFolderName)
      }

      console.log(`Creando archivo: ${fileName} en ${subFolderName || 'raíz'}`)
      const fileHandle = await targetDir.getFileHandle(fileName, { create: true })

      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()

      console.log('✅ ESCRITURA COMPLETADA') // Si no ves este log, algo falló arriba
    } catch (error) {
      console.error('❌ ERROR FATAL EN WRITEFILE:', error)
      throw error
    }
  }
}
