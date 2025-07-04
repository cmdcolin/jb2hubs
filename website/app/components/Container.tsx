import Breadcrumbs from './Breadcrumbs.tsx'

export default function Container({
  children,
  className = 'w-1/2',
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={className}>
        <Breadcrumbs />
        {children}
      </div>
    </div>
  )
}
