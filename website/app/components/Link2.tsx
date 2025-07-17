import { StyledLink } from './ui/Link.tsx'

export default function Link2({
  href,
  children,
  rel,
}: {
  href: string
  children: React.ReactNode
  rel?: string
}) {
  const isExternal = href.startsWith('http') || href.startsWith('https')

  return (
    <StyledLink href={href} rel={rel} external={isExternal}>
      {children}
    </StyledLink>
  )
}
