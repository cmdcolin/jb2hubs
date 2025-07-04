import Breadcrumbs from './Breadcrumbs.tsx'

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div>
        <Breadcrumbs />
        {children}
      </div>
    </div>
  )
}
