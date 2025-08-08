import * as fs from 'fs'
import { hubCategories } from 'hubtools'

/**
 * Capitalizes the first letter of a given string.
 * @param val - The input string.
 * @returns The string with its first letter capitalized.
 */
function capitalizeFirstLetter(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1)
}
/**
 * Generates Next.js page files for each hub category.
 * These pages will display hub information on the website.
 */
function generateHubPages() {
  for (const { id } of hubCategories) {
    const dirPath = `../website/app/hubs/${id}/`
    const filePath = `${dirPath}page.tsx`

    // Create directory recursively if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true })

    // Content for the page.tsx file
    const fileContent = `import Page from '../../components/Page.tsx'

export default function ${capitalizeFirstLetter(id)}() {
  return <Page title="${capitalizeFirstLetter(id)}" raw="${id}" />
}`

    // Write the file content to the page.tsx file
    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated hub page: ${filePath}`)
  }
}

generateHubPages()
