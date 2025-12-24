import { ipcMain, dialog } from 'electron'
import { readdir } from 'fs/promises'
import { join } from 'path'

export function registerIpcHandlers(): void {
  // Obtiene y devuelve los archivos de una carpeta
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (canceled || filePaths.length === 0) return null

    const rootPath = filePaths[0]

    try {
      const entries = await readdir(rootPath, { withFileTypes: true })

      const files = entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: join(rootPath, entry.name),
        nativeHandle: null
      }))

      return {
        path: rootPath,
        files: files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      }
    } catch (error) {
      console.error('Error reading directory: ', error)
      throw error
    }
  })
}
