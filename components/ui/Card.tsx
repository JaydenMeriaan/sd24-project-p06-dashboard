import React from 'react'
import Link from 'next/link'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  href?: string
}

export function Card({ children, className = '', hover = false, href }: CardProps) {
  const baseStyles =
    'bg-[#3E7B55] dark:bg-[#2E5C42] rounded-lg shadow-md border border-[#FFCC00] dark:border-[#FFCC00]' 
  const hoverStyles = hover ? 'transition-all hover:shadow-lg hover:scale-105' : ''
  const combinedStyles = `${baseStyles} ${hoverStyles} ${className}`

  if (href) {
    return (
      <Link href={href} className={`${combinedStyles} block`}>
        {children}
      </Link>
    )
  }

  return <div className={combinedStyles}>{children}</div>
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 border-b border-[#FFCC00] dark:border-[#FFCC00] ${className}`}>
     
      <h3 className="text-[#FFCC00] text-xl font-semibold">{children}</h3> 
    </div>
  )
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 border-t border-[#FFCC00] dark:border-[#FFCC00] ${className}`}>{children}</div> // Gele rand
  )
}
