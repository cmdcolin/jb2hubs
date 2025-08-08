import React from 'react';

export default function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}
