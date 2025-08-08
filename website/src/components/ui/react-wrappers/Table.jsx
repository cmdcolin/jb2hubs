import React from 'react';

export default function Table({ children, ...props }) {
  return <table {...props}>{children}</table>;
}