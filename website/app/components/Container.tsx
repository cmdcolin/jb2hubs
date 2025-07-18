import Breadcrumbs from './Breadcrumbs.tsx'

export default function Container({
  children,
  className = 'w-full px-4 sm:px-6 md:px-8 lg:w-1/2 lg:px-0 mb-20',
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
