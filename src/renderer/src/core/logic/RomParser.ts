export class RomParser {
  static cleanName(filename: string): string {
    const patternExtension = /\.[^/.]+$/
    const patternDisc = /\s*\(Dis[ck]\s+\d+\)/gi

    return filename.replace(patternExtension, '').replace(patternDisc, '').trim()
  }

  static isValidRom(filename: string): boolean {
    return filename.toLowerCase().endsWith('.chd')
  }
}
