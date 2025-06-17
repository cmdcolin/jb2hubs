import fs from 'fs'
export async function checkIfFileAccessible({ url }: { url: string }) {
  if (url.includes('hg19') || url.includes('hg38')) {
    const res = await fetch(
      url.startsWith('https') ? url : `https://hgdownload.soe.ucsc.edu${url}`,
      {
        method: 'HEAD',
      },
    )

    if (!res.ok) {
      console.error('404 or blocked', url)
      fs.appendFileSync('blockedFiles.txt', url + '\n')
    }
    return res.ok
  }
  return true
}
