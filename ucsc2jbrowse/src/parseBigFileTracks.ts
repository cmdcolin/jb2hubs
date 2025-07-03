import { TrackDbEntry } from './types.ts'
import { readJSON, splitOnFirst } from './util.ts'

/**
 * Parses a tracks.json file to extract information about bigData and BAM tracks.
 * It filters tracks based on their 'type' (starting with 'big' or 'bam')
 * and processes their settings string into a key-value object.
 * @param tracksJsonPath The path to the tracks.json file.
 */
function parseBigFileTracks(tracksJsonPath: string) {
  const tracks = readJSON<Record<string, TrackDbEntry>>(tracksJsonPath)

  const bigFileTracks = Object.fromEntries(
    Object.entries(tracks)
      .filter(([_key, trackEntry]) =>
        ['big', 'bam'].some(prefix => trackEntry.type.startsWith(prefix)),
      )
      .map(([key, trackEntry]) => {
        // Parse the settings string into an object
        const settings = Object.fromEntries(
          trackEntry.settings
            .split('\n')
            .map(settingLine => splitOnFirst(settingLine, ' '))
            .filter(([settingKey]) => !!settingKey), // Filter out empty keys
        )
        return [
          key,
          {
            ...trackEntry,
            settings,
          },
        ]
      }),
  )

  console.log(JSON.stringify(bigFileTracks, null, 2))
}

if (process.argv.length !== 3) {
  console.error('Usage: node parseBigFileTracks.ts <tracks.json>')
  process.exit(1)
}

parseBigFileTracks(process.argv[2]!)
