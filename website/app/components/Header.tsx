import Link from 'next/link'

function Links() {
  return (
    <ul className="p-2">
      <li>
        <Link href="/ucsc">Main browsers</Link>
      </li>
      <li>
        <Link href="/genark">GenArk browsers</Link>
      </li>
    </ul>
  )
}
export default function Header() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Genomes</a>
              <Links />
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">JBrowse 2 hubs</a>
      </div>
      <div className="navbar-left hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>Genomes</summary>
              <Links />
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}
