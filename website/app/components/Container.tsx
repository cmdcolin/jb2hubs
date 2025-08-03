import Breadcrumbs from './Breadcrumbs.tsx'
import styles from './Container.module.css'

export default function Container({
  children,
  className,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${className}`}>
        <Breadcrumbs />
        {children}
      </div>
    </div>
  )
}
