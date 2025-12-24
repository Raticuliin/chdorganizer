import { IFileSystem } from '../gateways/IFileSystem'
import { FolderContent } from '../domain/types'

export class NodeFileSystemAdapter implements IFileSystem {
  async selectAndReadFolder(): Promise<FolderContent | null> {
    try {
      const result = await window.electronAPI.selectFolder()

      if (!result) return null

      return result
    } catch (error) {
      console.error('Error on the file access: ', error)
      return null
    }
  }
}
