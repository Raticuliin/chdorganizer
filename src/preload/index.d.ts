import { ElectronAPI } from '@electron-toolkit/preload'
import { FolderContent } from '@renderer/core/domain/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: {
      selectFolder: () => Promise<FolderContent | null>
      createDirectory: (parentPath: string, name: string) => Promise<void>
      moveFile: (filePath: string, destPath: string) => Promise<void>
      writeFile: (fileName: string, content: string, subFolderName: string) => Promise<void>
    }
  }
}
