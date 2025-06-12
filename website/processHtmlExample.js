#!/usr/bin/env node

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
console.log(`Processing HTML file: ${inputFilePath}`)
console.log(`Output will be saved to: ${outputFilePath}`)

// Import required modules
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

// Import the removeRandomness function from test.js
const { removeRandomness } = require('./test.js')

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
    console.log('HTML processing completed successfully')
  })
  .catch(error => {
    console.error('Failed to process HTML:', error)
    process.exit(1)
  })
