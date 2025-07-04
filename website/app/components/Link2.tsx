import Link from 'next/link'

export default function Link2({
  href,
  children,
  rel,
}: {
  href: string
  children: React.ReactNode
  rel?: string
}) {
  return (
    <Link rel={rel} prefetch={false} href={href}>
      {children}
    </Link>
  )
}
