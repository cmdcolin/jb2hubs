'use client'

import Script from 'next/script'
import { useLayoutEffect } from 'react'

export default function Browser() {
  useLayoutEffect(() => {
    if (typeof window !== undefined) {
      // @ts-expect-error
      window.__jbrowseConfigPath =
        'https://jbrowse.org/hubs/genark/GCA/039/881/165/GCA_039881165.1/config.json'
    }
  })

  return (
    <>
      <Script src="/jb2hubs/static/js/main.b29bc7cb.js" />
      <div id="root"></div>
    </>
  )
}
