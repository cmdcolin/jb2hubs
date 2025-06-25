'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

// method for tracking open state from
// https://stackoverflow.com/a/76884775/2129219
export default function GenomesDropdown() {
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

  // Add click away listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false)
        // Need to manually close the details element since we're bypassing the toggle event
        if (detailsRef.current) {
          detailsRef.current.open = false
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])
  return (
    <details className="dropdown cursor-pointer" open={open} ref={detailsRef}>
      <summary className="m-1 ml-5">Genomes</summary>
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
