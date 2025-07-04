import * as fs from 'fs'

/**
 * Capitalizes the first letter of a given string.
 * @param val - The input string.
 * @returns The string with its first letter capitalized.
 */
function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

// Define the categories for which hub pages need to be created.
const hubCategories = [
  'primates',
  'mammals',
  'birds',
  'fish',
  'vertebrate',
  'invertebrate',
  'fungi',
  'plants',
  'viral',
  'bacteria',
  'VGP',
  'CCGP',
  'HPRC',
  'BRC',
  'globalReference',
  'legacy',
]

/**
 * Generates Next.js page files for each hub category.
 * These pages will display hub information on the website.
 */
function generateHubPages() {
  for (const category of hubCategories) {
    const dirPath = `../website/app/hubs/${category}/`
    const filePath = `${dirPath}page.tsx`

    // Create directory recursively if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true })

    // Content for the page.tsx file
    const fileContent = `import Page from '../../components/Page.tsx'

export default function ${capitalizeFirstLetter(category)}() {
  return <Page title="${capitalizeFirstLetter(category)}" raw="${category}" />
}`

    // Write the file content to the page.tsx file
    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated hub page: ${filePath}`)
  }
}

generateHubPages()
