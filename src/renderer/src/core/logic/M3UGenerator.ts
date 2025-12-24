import { GameGroup } from '../domain/types'

export class M3UGenerator {
  static generateFileContent(game: GameGroup): string {
    return game.files.map((disc) => disc.name).join('\n')
  }
}
