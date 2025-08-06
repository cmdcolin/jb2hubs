import React from 'react'

import styles from '../../DataTable.module.css'

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text
  
  const queryLower = query.toLowerCase().trim()
  const textLower = text.toLowerCase()
  
  // Find the position of the match
  const index = textLower.indexOf(queryLower)
  
  if (index === -1) return text
  
  // Split the text into parts: before, match, after
  const beforeMatch = text.substring(0, index)
  const match = text.substring(index, index + query.length)
  const afterMatch = text.substring(index + query.length)
  
  return (
    <>
      {beforeMatch}
      <mark className={styles.searchHighlight}>{match}</mark>
      {highlightText(afterMatch, query)}
    </>
  )
}