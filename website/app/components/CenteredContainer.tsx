import Breadcrumbs from './Breadcrumbs'

export default function CenteredContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="lg:w-1/2 m-auto">
      <Breadcrumbs />
      {children}
      <div style={{ height: 300 }} />
    </div>
  )
}
