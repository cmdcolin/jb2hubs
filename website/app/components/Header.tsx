import React from 'react'

import Link from 'next/link'

import Logo from '../logo.tsx'

export default function JBrowseNavbar() {
  const navItems = [
    { name: 'Genomes', href: '/' },
    { name: 'Docs', href: 'https://jbrowse.org/jb2/docs' },
    { name: 'Blog', href: 'https://jbrowse.org/jb2/blog' },
    { name: 'Download', href: 'https://jbrowse.org/jb2/download' },
    { name: 'Plugins', href: 'https://jbrowse.org/jb2/plugin_store' },
    { name: 'Features', href: 'https://jbrowse.org/jb2/features' },
    { name: 'Gallery', href: 'https://jbrowse.org/jb2/gallery' },
    { name: 'Demos', href: 'https://jbrowse.org/jb2/demos' },
    { name: 'Contact', href: 'https://jbrowse.org/jb2/contact' },
  ]

  return (
    <nav className="bg-[#0d223f] text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={'https://jbrowse.org/jb2/'} className="mr-4">
            <Logo alt="logo" width={30.8} height={32} className="inline mr-2" />
            <b
              className={`font-semibold flex-auto items-center hover:text-[#25c2a0] transition-colors text-[16px]`}
            >
              JBrowse
            </b>
          </Link>
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:text-[#25c2a0] transition-colors px-[12px] py-[4px] text-[16px]`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side - Social links and search */}
        <div className="flex items-center space-x-4">
          {/* GitHub icon */}
          <Link
            href="https://github.com/GMOD/jbrowse-component"
            className="hover:text-[#25c2a0] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>

          {/* Mastodon icon */}
          <Link
            href="https://genomic.social/@usejbrowse"
            className="hover:text-[#25c2a0] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
            </svg>
          </Link>

          {/* BlueSky icon */}
          <Link
            href="https://bsky.app/profile/jbrowse.org"
            className="hover:text-[#25c2a0] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 600 530">
              <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
            </svg>
          </Link>
          {/**/}
          {/*  Search  */}
          {/* <div className="flex items-center bg-slate-700 rounded px-3 py-1"> */}
          {/*   <Search className="w-4 h-4 text-gray-400 mr-2" /> */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     placeholder="Search..." */}
          {/*     className="bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none w-32" */}
          {/*   /> */}
          {/* </div> */}
        </div>
      </div>
    </nav>
  )
}
