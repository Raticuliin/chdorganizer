import { create } from 'zustand'

import { FileEntry, GameGroup } from '../../core/domain/types'
import { GameGrouper } from '../../core/logic/GameGrouper'

interface FileState {
  status: 'idle' | 'loading' | 'ready' | 'processing' | 'done'

  rootName: string
  files: FileEntry[]
  games: GameGroup[]

  setFolderContent: (rootName: string, files: FileEntry[]) => void
  clear: () => void
}

export const useFileStore = create<FileState>((set) => ({
  // Valores iniciales
  status: 'idle',
  rootName: '',
  files: [],
  games: [],

  setFolderContent: (rootName, files) => {
    set({ status: 'loading' })

    try {
      const groupedGames = GameGrouper.groupFiles(files)

      set({
        rootName,
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
      rootName: '',
      files: [],
      games: []
    })
}))
