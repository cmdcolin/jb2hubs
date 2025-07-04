import Breadcrumbs from './Breadcrumbs'

export default function UncenteredContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="lg:w-7/8 m-auto">
      <Breadcrumbs />
      {children}
      <div style={{ height: 300 }} />
    </div>
  )
}
