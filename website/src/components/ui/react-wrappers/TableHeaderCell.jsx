import React from 'react';

export default function TableHeaderCell({ children, ...props }) {
  return <th {...props}>{children}</th>;
}
