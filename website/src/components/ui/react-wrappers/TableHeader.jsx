import React from 'react';

export default function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}
