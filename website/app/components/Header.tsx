'use client'

import { useRef } from 'react'

import Link from 'next/link'

export default function Header() {
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false
    }
  }
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          JBrowse 2 hubs
        </Link>
        <ul className="menu menu-horizontal px-1">
          <li>
            <details ref={dropdownRef}>
              <summary>Genomes</summary>
              <ul className="p-2">
                <li>
                  <Link href="/ucsc" onClick={closeDropdown}>
                    Main browsers
                  </Link>
                </li>
                <li>
                  <Link href="/genark" onClick={closeDropdown}>
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
