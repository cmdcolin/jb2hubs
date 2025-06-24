'use client'

import { useState } from 'react'

import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          JBrowse 2 hubs
        </Link>
        <ul className="menu menu-horizontal px-1">
          <li>
            <details open={open} onClick={() => setOpen(!open)}>
              <summary>Genomes</summary>
              <ul className="p-2">
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
          </li>
        </ul>
      </div>
    </div>
  )
}
