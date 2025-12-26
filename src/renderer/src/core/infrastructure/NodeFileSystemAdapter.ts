import { IFileSystem } from '../gateways/IFileSystem'
import { FileEntry, FolderContent } from '../domain/types'

export class NodeFileSystemAdapter implements IFileSystem {
  async selectAndReadFolder(): Promise<FolderContent | null> {
    try {
      const result = await window.electronAPI.selectFolder()

      if (!result) return null

      return {
        rootPath: result.rootPath,
        files: result.files
      }
    } catch (error) {
      console.error('Error on the file access: ', error)
      return null
    }
  }

  async createDirectory(parentPath: string, name: string): Promise<void> {
    try {
      await window.electronAPI.createDirectory(parentPath, name)
    } catch (error) {
      console.error('Error creating directory: ', error)
      throw error
    }
  }
  async moveFile(file: FileEntry, destPath: string): Promise<void> {
    if (!file.path) {
      throw new Error(`File ${file.name} has no valid path.`)
    }

    try {
      await window.electronAPI.moveFile(file.path, destPath)
    } catch (error) {
      console.error('Error moving file: ', error)
      throw error
    }
  }

  async writeFile(path: string, content: string, subFolderName?: string): Promise<void> {
    try {
      await window.electronAPI.writeFile(path, content, subFolderName ?? '')
    } catch (error) {
      console.error('Error writting file: ', error)
      throw error
    }
  }
}
