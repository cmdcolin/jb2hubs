import fs from 'fs'

/**
 * Checks if a given URL is accessible by making a HEAD request.
 * If the URL is not accessible and contains 'hg19' or 'hg38', it logs the URL to 'blockedFiles.txt'.
 * @param url The URL to check.
 * @returns A promise that resolves to true if the file is accessible, false otherwise.
 */
export async function checkIfFileAccessible({ url }: { url: string }) {
  // Only perform HEAD request for UCSC-related URLs
  if ((url.includes('hg19') || url.includes('hg38')) && process.env.CHECK_404) {
    try {
      const response = await fetch(
        url.startsWith('https') ? url : `https://hgdownload.soe.ucsc.edu${url}`,
        {
          method: 'HEAD',
        },
      )

      if (!response.ok) {
        console.error(
          `File not accessible (status: ${response.status}): ${url}`,
        )
        fs.appendFileSync('blockedFiles.txt', url + '\n')
        return false
      }
      return true
    } catch (error) {
      console.error(`Error checking file accessibility for ${url}: ${error}`)
      fs.appendFileSync('blockedFiles.txt', url + '\n')
      return false
    }
  }
  // For non-UCSC URLs, assume accessibility or handle elsewhere
  return true
}
