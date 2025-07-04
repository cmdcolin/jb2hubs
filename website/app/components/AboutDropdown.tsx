'use client'
import Link2 from 'next/link'

// method for tracking open state from
// https://stackoverflow.com/a/76884775/2129219
export default function AboutDropdown() {
  return (
    <div className="dropdown dropdown-start">
      <div tabIndex={0} role="button" className="btn btn-ghost m-1">
        Help
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
      >
        <li>
          <Link2
            href="/about"
            onClick={() => {
              // @ts-expect-error
              document.activeElement.blur()
            }}
          >
            About
          </Link2>
        </li>
      </ul>
    </div>
  )
}
