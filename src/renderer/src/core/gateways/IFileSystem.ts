import { FileEntry, FolderContent } from '../domain/types'

export interface IFileSystem {
  selectAndReadFolder(): Promise<FolderContent | null>
  createDirectory(parentPath: string, name: string): Promise<void>
  moveFile(file: FileEntry, destPath: string): Promise<void>
  writeFile(path: string, content: string, subFolderName?: string): Promise<void>
}
