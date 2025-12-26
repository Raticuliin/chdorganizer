import { ipcMain, dialog } from 'electron'
import { readdir, mkdir, rename, writeFile } from 'fs/promises'
import { join, dirname, basename } from 'path'

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
        rootPath: rootPath,
        files: files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      }
    } catch (error) {
      console.error('Error reading directory: ', error)
      throw error
    }
  })

  ipcMain.handle('fs:createDirectory', async (_, parentPath: string, name: string) => {
    console.log('Recibido en Main:', { parentPath, name })

    if (!parentPath || !name) {
      throw new Error(`Argumentos inválidos: parentPath=${parentPath}, name=${name}`)
    }

    const fullPath = join(parentPath, name)
    await mkdir(fullPath, { recursive: true })
  })

  ipcMain.handle('fs:moveFile', async (_, filePath: string, destPath: string) => {
    try {
      const rootDir = dirname(filePath)
      const fileName = basename(filePath)
      const newPath = join(rootDir, destPath, fileName)

      await rename(filePath, newPath)
    } catch (error) {
      console.error('Error moving file:', error)
      throw error
    }
  })

  ipcMain.handle('fs:writeFile', async (_, fullPath: string, content: string) => {
    try {
      await writeFile(fullPath, content, 'utf-8')
    } catch (error) {
      console.error('Error al writting file', error)
      throw error
    }
  })
}
