export function extractStats(xmlString: string) {
  const stats = {} as Record<string, unknown>
  const statsRegex =
    /<Stat category="([^"]+)" sequence_tag="([^"]+)">([^<]+)<\/Stat>/g
  let match

  while ((match = statsRegex.exec(xmlString)) !== null) {
    stats[match[1]!] = match[3]!
  }

  return stats
}
