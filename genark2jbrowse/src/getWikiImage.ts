import * as fs from 'fs'
import * as path from 'path'

import slugify from 'slugify'

import { readJSON } from './util.ts'

interface SpeciesEntry {
  accession: string
  scientificName: string
}

interface WikipediaPageInfo {
  title?: string
  thumbnail?: {
    source: string
  }
  originalimage?: {
    source: string
  }
  content_urls?: {
    desktop?: {
      page?: string
    }
  }
}

interface WikipediaImageInfo {
  url?: string
  thumburl?: string
}

// Set up headers for Wikipedia API compliance
const HEADERS = {
  'User-Agent':
    'WikipediaImageDownloader/1.0 (https://github.com/user/repo; user@example.com)',
}

async function getWikipediaPageInfo(
  scientificName: string,
): Promise<WikipediaPageInfo | null> {
  const apiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

  const tryName = async (name: string): Promise<WikipediaPageInfo | null> => {
    try {
      const response = await fetch(`${apiUrl}${encodeURIComponent(name)}`, {
        headers: HEADERS,
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Ignore error and try next approach
    }
    return null
  }

  // Try direct lookup first
  let result = await tryName(scientificName)
  if (result) return result

  // Try with underscores instead of spaces
  const nameWithUnderscores = scientificName.replace(' ', '_')
  result = await tryName(nameWithUnderscores)
  if (result) return result

  // Try search API as fallback
  try {
    const searchUrl = 'https://en.wikipedia.org/w/api.php'
    const searchParams = new URLSearchParams({
      action: 'opensearch',
      search: scientificName,
      limit: '3',
      format: 'json',
    })

    const searchResponse = await fetch(`${searchUrl}?${searchParams}`, {
      headers: HEADERS,
    })
    const searchData = await searchResponse.json()

    // Try each search result
    if (Array.isArray(searchData) && searchData[1]) {
      for (const pageTitle of searchData[1]) {
        result = await tryName(pageTitle)
        if (result) return result
      }
    }
  } catch (error) {
    console.error(`Error with search API: ${error}`)
  }

  return null
}

async function getWikipediaImages(pageTitle: string): Promise<string | null> {
  try {
    // Use the MediaWiki API to get images from the page
    const apiUrl = 'https://en.wikipedia.org/w/api.php'
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: pageTitle,
      prop: 'images',
      imlimit: '10',
    })

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: HEADERS,
    })
    const data = await response.json()

    const pages = data?.query?.pages || {}
    for (const pageId in pages) {
      const pageData = pages[pageId]
      if (pageData.images) {
        // Filter out common non-content images
        const excludedPatterns = [
          'commons-logo',
          'edit-icon',
          'wikimedia',
          'wikidata',
          'disambiguation',
          'ambox',
          'question_book',
          'merge-arrow',
          'folder_hexagonal',
        ]

        for (const image of pageData.images) {
          const imageTitle = image.title
          // Skip common Wikipedia interface images
          if (
            !excludedPatterns.some(pattern =>
              imageTitle.toLowerCase().includes(pattern),
            )
          ) {
            return await getImageUrl(imageTitle)
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error(`Error getting images from Wikipedia: ${error}`)
    return null
  }
}

async function getImageUrl(imageTitle: string): Promise<string | null> {
  try {
    const apiUrl = 'https://en.wikipedia.org/w/api.php'
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: imageTitle,
      prop: 'imageinfo',
      iiprop: 'url|size',
      iiurlwidth: '800',
    })

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: HEADERS,
    })
    const data = await response.json()

    const pages = data?.query?.pages || {}
    for (const pageId in pages) {
      const pageData = pages[pageId]
      if (pageData.imageinfo && pageData.imageinfo[0]) {
        const imageInfo: WikipediaImageInfo = pageData.imageinfo[0]
        // Prefer the thumbnail if available, otherwise use the original
        return imageInfo.thumburl || imageInfo.url || null
      }
    }

    return null
  } catch (error) {
    console.error(`Error getting image URL: ${error}`)
    return null
  }
}

function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const extension = path.substring(path.lastIndexOf('.')).toLowerCase()
    return extension || '.jpg'
  } catch {
    return '.jpg'
  }
}

async function downloadImage(
  imageUrl: string,
  filename: string,
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: HEADERS,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Ensure directory exists
    const speciesImagesDir = 'speciesImages'
    if (!fs.existsSync(speciesImagesDir)) {
      fs.mkdirSync(speciesImagesDir, { recursive: true })
    }

    const filepath = path.join(speciesImagesDir, filename)
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filepath, new Uint8Array(buffer))

    return filepath
  } catch (error) {
    console.error(`Error downloading image: ${error}`)
    return null
  }
}

async function processSpeciesImage(scientificName: string): Promise<void> {
  // Create slugified filename
  const safeName = slugify(scientificName)
  const txtFilename = `${safeName}.txt`
  const txtFilePath = path.join('speciesImages', txtFilename)

  // Check if already processed with 'none' result
  if (fs.existsSync(txtFilePath)) {
    try {
      const content = fs.readFileSync(txtFilePath, 'utf8').trim()
      if (content === 'none') {
        console.log(
          `Already processed '${scientificName}' - no image found previously. Skipping.`,
        )
        return
      }
    } catch (error) {
      console.warn(
        `Warning: Could not read existing file ${txtFilePath}: ${error}`,
      )
    }
  }

  console.log(`Searching for: ${scientificName}`)

  // Try to get Wikipedia page info
  const pageInfo = await getWikipediaPageInfo(scientificName)

  if (!pageInfo) {
    console.log(`Could not find Wikipedia page for '${scientificName}'`)

    // Save 'none' to prevent retrying
    try {
      fs.mkdirSync('speciesImages', { recursive: true })
      fs.writeFileSync(txtFilePath, 'none')
      console.log(`✓ No Wikipedia page found, 'none' saved to: ${txtFilePath}`)
    } catch (error) {
      console.error(`✗ Failed to save 'none' to file: ${error}`)
    }
    return
  }

  console.log(`Found page: ${pageInfo.title || 'Unknown'}`)

  // Try to get the first image from the page using the API
  let imageUrl: string | null = null
  const pageTitle = pageInfo.title || ''

  if (pageTitle) {
    imageUrl = await getWikipediaImages(pageTitle)
  }

  // If no image found via API, try the thumbnail from the summary
  if (!imageUrl && pageInfo.thumbnail) {
    imageUrl = pageInfo.thumbnail.source
    console.log(`Using thumbnail from page summary: ${imageUrl}`)
  } else if (imageUrl) {
    console.log(`Found first image from page: ${imageUrl}`)
  }

  if (!imageUrl) {
    console.log('No image found on the Wikipedia page')

    // Save 'none' to prevent retrying
    try {
      fs.writeFileSync(txtFilePath, 'none')
      console.log(
        `✓ No image found on Wikipedia page, 'none' saved to: ${txtFilePath}`,
      )
    } catch (error) {
      console.error(`✗ Failed to save 'none' to file: ${error}`)
    }
    return
  }

  // Save the image URL to a text file
  try {
    fs.writeFileSync(txtFilePath, imageUrl)
    console.log(`✓ Image URL saved to: ${txtFilePath}`)
  } catch (error) {
    try {
      fs.writeFileSync(txtFilePath, 'none')
      console.log(
        `✓ Error saving image URL, 'none' saved to: ${txtFilePath}: ${error}`,
      )
    } catch (innerError) {
      console.error(`✗ Failed to save image URL file: ${innerError}`)
    }
  }

  // Download the actual image file
  if (imageUrl) {
    const extension = getFileExtension(imageUrl)
    const imageFilename = `${safeName}${extension}`

    console.log('Downloading image...')
    const filepath = await downloadImage(imageUrl, imageFilename)
    if (filepath) {
      console.log(`✓ Image downloaded to: ${filepath}`)
    } else {
      console.log('✗ Failed to download image')
    }
  }

  // Write the Wikipedia page URL to a separate text file
  const pageUrl = pageInfo.content_urls?.desktop?.page || ''
  const pageTxtFilePath = path.join('speciesImages', `${safeName}_page.txt`)
  try {
    if (pageUrl) {
      fs.writeFileSync(pageTxtFilePath, pageUrl)
      console.log(`✓ Wikipedia page URL saved to: ${pageTxtFilePath}`)
    } else {
      fs.writeFileSync(pageTxtFilePath, 'none')
      console.log(
        `✓ No Wikipedia page URL found, 'none' saved to: ${pageTxtFilePath}`,
      )
    }
  } catch (error) {
    try {
      fs.writeFileSync(pageTxtFilePath, 'none')
      console.log(
        `✓ Error saving Wikipedia page URL, 'none' saved to: ${pageTxtFilePath}: ${error}`,
      )
    } catch (innerError) {
      console.error(`✗ Failed to save Wikipedia page URL file: ${innerError}`)
    }
  }
}

const allProcessedEntries = (
  await readJSON<(SpeciesEntry | null)[]>('processedHubJson/all.json')
).filter((entry): entry is SpeciesEntry => !!entry)

console.log(
  `Processing ${allProcessedEntries.length} species for Wikipedia images...`,
)

let processedCount = 0
for (const entry of allProcessedEntries) {
  const { scientificName } = entry
  const imageFileName = `${slugify(scientificName)}.txt`
  const imageFilePath = path.join('speciesImages', imageFileName)

  // Check if the image file already exists
  if (!fs.existsSync(imageFilePath)) {
    try {
      console.log(
        `Downloading image for ${scientificName} (${++processedCount}/${allProcessedEntries.length})`,
      )

      await processSpeciesImage(scientificName)

      // Add a small delay to avoid rate limiting Wikipedia's API
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error downloading image for ${scientificName}: ${error}`)
    }
  } else {
    console.log(`Image already found for ${scientificName}.`)
  }
}
