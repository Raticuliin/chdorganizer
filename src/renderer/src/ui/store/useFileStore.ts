import { create } from 'zustand'

import { WebFileSystemAdapter } from '@renderer/core/infrastructure/WebFileSystemAdapter'
import { NodeFileSystemAdapter } from '@renderer/core/infrastructure/NodeFileSystemAdapter'

import { FileEntry, GameGroup } from '../../core/domain/types'
import { GameGrouper } from '../../core/logic/GameGrouper'

const isElectron = typeof window !== 'undefined' && !!window.electronAPI
const fsAdapter = isElectron ? new NodeFileSystemAdapter() : new WebFileSystemAdapter()

interface FileState {
  status: 'idle' | 'loading' | 'ready' | 'processing' | 'done'

  rootPath: string
  files: FileEntry[]
  games: GameGroup[]

  scanFolder: () => Promise<void>
  setFolderContent: (rootPath: string, files: FileEntry[]) => void
  clear: () => void

  organizeTest: (game: GameGroup) => Promise<void>
}

export const useFileStore = create<FileState>((set, get) => ({
  // Valores iniciales
  status: 'idle',
  rootPath: '',
  files: [],
  games: [],

  scanFolder: async () => {
    set({ status: 'loading' })

    try {
      const result = await fsAdapter.selectAndReadFolder()

      if (result) {
        get().setFolderContent(result.rootPath, result.files)
      } else {
        set({ status: 'idle' })
      }
    } catch (error) {
      console.error('Error scanning folder:', error)
      set({ status: 'idle' })
    }
  },

  setFolderContent: (rootPath, files) => {
    set({ status: 'loading' })

    try {
      const groupedGames = GameGrouper.groupFiles(files)

      set({
        rootPath,
        files,
        games: groupedGames,
        status: 'ready'
      })
    } catch (error) {
      console.error('Error grouping files: ', error)
      set({ status: 'idle' })
    }
  },

  clear: () =>
    set({
      status: 'idle',
      rootPath: '',
      files: [],
      games: []
    }),

  organizeTest: async (game: GameGroup) => {
    const { rootPath } = get()

    if (!rootPath) {
      console.error('No se puede organizar: rootPath está vacío')
      return
    }

    set({ status: 'processing' })

    try {
      // 1. La carpeta se llamará "Final Fantasy VII.m3u"
      const folderName = `${game.gameName}.m3u`

      console.log('Creando carpeta especial...', folderName)
      await fsAdapter.createDirectory(rootPath, folderName)

      // 2. Mover los archivos a esa carpeta .m3u
      for (const file of game.files) {
        console.log(`Moviendo ${file.name} a ${folderName}`)
        await fsAdapter.moveFile(file, folderName)
      }

      // 3. Escribir el archivo de índice M3U DENTRO de la carpeta .m3u
      // La ruta final será: /ruta/raiz/NombreJuego.m3u/NombreJuego.m3u
      const m3uFileName = `${game.gameName}.m3u`
      const fullM3uPath = `${rootPath}/${folderName}/${m3uFileName}`

      const m3uContent = game.files.map((f) => f.name).join('\n')

      console.log('Escribiendo índice m3u interno...')
      await fsAdapter.writeFile(fullM3uPath, m3uContent)

      // 4. Refrescar la UI para que desaparezcan los archivos movidos
      await get().scanFolder()

      console.log('¡Estructura de carpeta .m3u completada!')
      set({ status: 'done' })
    } catch (error) {
      console.error('Error en la organización:', error)
      set({ status: 'ready' })
    }
  }
}))
