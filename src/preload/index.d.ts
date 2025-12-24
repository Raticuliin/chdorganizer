import { ElectronAPI } from '@electron-toolkit/preload'
import { FolderContent } from '@renderer/core/domain/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: {
      selectFolder: () => Promise<FolderContent | null>
    }
  }
}
