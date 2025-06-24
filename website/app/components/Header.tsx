'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

// method for tracking open state from
// https://stackoverflow.com/a/76884775/2129219
function GenomesDropdown() {
  const [open, setOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const onToggleCallback = useCallback(() => {
    if (detailsRef.current) {
      setOpen(detailsRef.current.open)
    }
  }, [])

  useEffect(() => {
    detailsRef.current?.addEventListener('toggle', onToggleCallback)

    return () => {
      detailsRef.current?.removeEventListener('toggle', onToggleCallback)
    }
  }, [onToggleCallback])
  return (
    <details className="dropdown" open={open} ref={detailsRef}>
      <summary className="m-1">Genomes</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li>
          <Link href="/ucsc" onClick={() => setOpen(false)}>
            Main browsers
          </Link>
        </li>
        <li>
          <Link href="/genark" onClick={() => setOpen(false)}>
            GenArk browsers
          </Link>
        </li>
      </ul>
    </details>
  )
}

export default function Header() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          JBrowse 2 hubs
        </Link>
        <GenomesDropdown />
      </div>
    </div>
  )
}
