import React from 'react';

interface PageProps {
  title?: string;
  raw?: string;
}

export default function Page({ title, raw }: PageProps) {
  return (
    <div>
      <h1>{title}</h1>
      <pre>{raw}</pre>
    </div>
  );
}
