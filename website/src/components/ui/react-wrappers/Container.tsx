import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // To allow for ...props
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className="container">
      <div className={`content ${className || ''}`} {...props}>
        {children}
      </div>
    </div>
  );
}