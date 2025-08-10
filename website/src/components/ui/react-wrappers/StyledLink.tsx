import React from 'react';

interface StyledLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any; // To allow for ...props
}

export default function StyledLink({ href, children, ...props }: StyledLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}