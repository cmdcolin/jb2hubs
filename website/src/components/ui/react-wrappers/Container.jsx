import React from 'react'

export default function Container({ children, className, ...props }) {
  return (
    <div className="container">
      <div className={`content ${className || ''}`} {...props}>
        {children}
      </div>
    </div>
  )
}
