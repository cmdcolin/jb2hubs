import AboutDropdown from './AboutDropdown.tsx'
import GenomesDropdown from './GenomesDropdown.tsx'

export default function Header() {
  return (
    <div className="navbar m-0 p-0">
      <div className="navbar-start">
        <div className="text-xl">JBrowse 2 hubs</div>
        <GenomesDropdown />
        <AboutDropdown />
      </div>
    </div>
  )
}
