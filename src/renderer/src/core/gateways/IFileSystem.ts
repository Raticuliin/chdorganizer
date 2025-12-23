import { FolderContent } from '../domain/types'

export interface IFileSystem {
  selectAndReadFolder(): Promise<FolderContent | null>
}
