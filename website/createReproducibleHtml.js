#!/usr/bin/env node

// replaceRandomness function credit @junerd
// https://github.com/vercel/next.js/discussions/65856#discussioncomment-12667717
function removeRandomness(el) {
  const prefix = `[\\"$\\",\\"$1\\",\\"`
  const suffix = `\\"`
  const prefixIndexes = []
  let index = -1
  do {
    if (typeof index === 'number') {
      prefixIndexes.push(index)
    }
    index = el.innerHTML.indexOf(prefix, index + 1)
  } while (index !== -1)
  prefixIndexes.shift()
  prefixIndexes.forEach(prefixIndex => {
    const startIndex = prefixIndex + prefix.length
    const endIndex = el.innerHTML.indexOf(suffix, startIndex)
    if (endIndex - startIndex < 2) {
      return
    }
    const randomness = el.innerHTML.substring(startIndex, endIndex)
    const original = el.innerHTML.substring(
      prefixIndex,
      endIndex + suffix.length,
    )
    el.innerHTML = el.innerHTML.replace(randomness, 'stable-id')

    const modified = el.innerHTML.substring(
      prefixIndex,
      el.innerHTML.indexOf(suffix, startIndex) + suffix.length,
    )
    // console.log(
    //   `👉 Replaced ${original} with ${modified} to stabilize build output`,
    // )
  })
}

/**
 * Example script to demonstrate how to use the stabilizeHtml.js file
 * This script processes an HTML file and removes randomness from it
 *
 * Usage: node processHtmlExample.js <input-html-file> [output-html-file]
 */

// Get command line arguments
const args = process.argv.slice(2)

if (args.length < 1) {
  console.error(
    'Usage: node processHtmlExample.js <input-html-file> [output-html-file]',
  )
  process.exit(1)
}

const inputFilePath = args[0]
const outputFilePath =
  args.length > 1 ? args[1] : inputFilePath.replace('.html', '.stable.html')

// Process the HTML file
// console.log(`Processing HTML file: ${inputFilePath}`)
// console.log(`Output will be saved to: ${outputFilePath}`)

// Import required modules
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

/**
 * Processes an HTML file to remove randomness
 * @param {string} inputFilePath - Path to the input HTML file
 * @param {string} outputFilePath - Path to save the processed HTML file (optional)
 * @returns {Promise<string>} - The processed HTML content
 */
async function processHtmlFile(inputFilePath, outputFilePath) {
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(inputFilePath, 'utf8')

    // Parse the HTML using JSDOM
    const dom = new JSDOM(htmlContent)
    const document = dom.window.document

    // Find all elements in the document
    const allElements = document.querySelectorAll('*')

    // Apply removeRandomness to each element
    allElements.forEach(el => {
      // Create a wrapper with innerHTML property for compatibility with the function
      const wrapper = {
        innerHTML: el.outerHTML,
      }

      // Apply the removeRandomness function
      removeRandomness(wrapper)

      // If the innerHTML was changed, update the element
      if (wrapper.innerHTML !== el.outerHTML) {
        // Replace the element with the modified version
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = wrapper.innerHTML
        el.parentNode.replaceChild(tempDiv.firstChild, el)
      }
    })

    // Get the processed HTML
    const processedHtml = dom.serialize()

    // Save to output file if specified
    if (outputFilePath) {
      fs.writeFileSync(outputFilePath, processedHtml, 'utf8')
      console.log(`Processed HTML saved to ${outputFilePath}`)
    }

    return processedHtml
  } catch (error) {
    console.error('Error processing HTML file:', error)
    throw error
  }
}

processHtmlFile(inputFilePath, outputFilePath)
  .then(() => {
    // console.log('HTML processing completed successfully')
  })
  .catch(error => {
    console.error('Failed to process HTML:', error)
    process.exit(1)
  })
