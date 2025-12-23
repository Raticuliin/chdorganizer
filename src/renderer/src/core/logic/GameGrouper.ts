import { FileEntry, GameGroup } from '../domain/types'
import { RomParser } from './RomParser'

export class GameGrouper {
  static groupFiles(files: FileEntry[]): GameGroup[] {
    const groups = new Map<string, FileEntry[]>()

    files.forEach((file) => {
      if (!file.isDirectory && RomParser.isValidRom(file.name)) {
        const cleanName = RomParser.cleanName(file.name)

        if (!groups.has(cleanName)) {
          groups.set(cleanName, [])
        }

        groups.get(cleanName)?.push(file)
      }
    })

    const result: GameGroup[] = []

    groups.forEach((groupFiles, gameName) => {
      groupFiles.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true
        })
      )

      result.push({
        gameName: gameName,
        files: groupFiles,
        needsM3u: groupFiles.length > 1
      })
    })

    return result.sort((a, b) => a.gameName.localeCompare(b.gameName))
  }
}
