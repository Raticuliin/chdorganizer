import { create } from 'zustand'

import { WebFileSystemAdapter } from '@renderer/core/infrastructure/WebFileSystemAdapter'
import { NodeFileSystemAdapter } from '@renderer/core/infrastructure/NodeFileSystemAdapter'

import { FileEntry, GameGroup } from '../../core/domain/types'
import { GameGrouper } from '../../core/logic/GameGrouper'

const isElectron = typeof window !== 'undefined' && !!window.electronAPI

const fsAdapter = isElectron ? new NodeFileSystemAdapter() : new WebFileSystemAdapter()

interface FileState {
  status: 'idle' | 'loading' | 'ready' | 'processing' | 'done'

  rootName: string
  files: FileEntry[]
  games: GameGroup[]

  scanFolder: () => Promise<void>
  setFolderContent: (rootName: string, files: FileEntry[]) => void
  clear: () => void
}

export const useFileStore = create<FileState>((set, get) => ({
  // Valores iniciales
  status: 'idle',
  rootName: '',
  files: [],
  games: [],

  scanFolder: async () => {
    set({ status: 'loading' })

    try {
      const result = await fsAdapter.selectAndReadFolder()

      if (result) {
        get().setFolderContent(result.rootName, result.files)
      } else {
        set({ status: 'idle' })
      }
    } catch (error) {
      console.error('Error scanning folder:', error)
      set({ status: 'idle' })
    }
  },

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
