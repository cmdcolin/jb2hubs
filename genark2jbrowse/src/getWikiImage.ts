import * as fs from 'fs'
import * as path from 'path'

function getHubBasePath(accession: string): string {
  const [basePrefix, restOfAccession] = accession.split('_')
  const [part1, part2, part3] = restOfAccession!.match(/.{1,3}/g)!
  return `hubs/${basePrefix}/${part1}/${part2}/${part3}/${accession}`
}

function processSpeciesName(speciesName: string): string {
  return speciesName
    .replace(/\s+\d+\s*$/, '') // Remove trailing numbers
    .replace(/\s+(str\.|strain).*$/i, '') // Remove anything after "str." or "strain"
    .trim()
}

async function getWikipediaMainImage(pageTitle: string, lang = 'en') {
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php`

  // API parameters to get page information and images
  const params = {
    action: 'query',
    titles: pageTitle,
    prop: 'pageimages',
    pithumbsize: '500', // Set the desired thumbnail size
    format: 'json',
    redirects: '1', // Automatically follow redirects
  }

  // Construct the URL with query parameters
  const queryString = new URLSearchParams(params as any).toString()
  const url = `${apiUrl}?${queryString}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`)
  }

  const data = await response.json()
  const pages = data.query?.pages

  if (!pages) {
    throw new Error(`Could not find pages in the API response for ${url}`)
  }

  // The API returns page IDs as keys, so we need to get the first one
  const pageId = Object.keys(pages)[0]!
  const page = pages[pageId]

  // Check if the page exists and has a thumbnail
  if (pageId === '-1' || !page.thumbnail) {
    throw new Error(
      `Page "${pageTitle}" not found or no thumbnail image available.`,
    )
  }

  // The 'thumbnail' object contains the image URL
  return page.thumbnail.source
}

async function processSpeciesImage(scientificName: string, accession: string) {
  const hubBasePath = getHubBasePath(accession)
  const filePath = path.join(hubBasePath, `image.json`)

  try {
    const processedName = processSpeciesName(scientificName)
    const imageUrl = await getWikipediaMainImage(processedName)
    if (!imageUrl) {
      throw new Error('No image URL detected in response')
    }
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          imageUrl,
          pageUrl: `https://wikipedia.org/wiki/${processedName}`,
        },
        null,
        2,
      ),
    )
    console.log(`Found image for `, scientificName)
  } catch (e) {
    console.log(`${e}`)
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          imageUrl: 'none',
          pageUrl: 'none',
        },
        null,
        2,
      ),
    )
  }
}

const scientificName = process.argv[2]!
const accession = process.argv[3]!

await processSpeciesImage(scientificName, accession)
