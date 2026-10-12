'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './Button'

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-[#3E7B55] dark:bg-[#2E5C42] border-b border-[#FFCC00] dark:border-[#FFCC00] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/overview" className="text-xl font-bold text-[#FFCC00] dark:text-[#FFCC00]">
              Tokkiemannen
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/overview"
                className={`text-sm font-medium transition-colors ${
                  isActive('/overview')
                    ? 'text-[#FFCC00] dark:text-[#FFCC00]'
                    : 'text-white dark:text-gray-300 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]'
                }`}
              >
                Overzicht
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-[#FFCC00] dark:text-[#FFCC00]'
                    : 'text-white dark:text-gray-300 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]'
                }`}
              >
                Contact
              </Link>
              <Link
                href="/support"
                className={`text-sm font-medium transition-colors ${
                  isActive('/support')
                    ? 'text-[#FFCC00] dark:text-[#FFCC00]'
                    : 'text-white dark:text-gray-300 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]'
                }`}
              >
                Ondersteuning
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-white dark:text-gray-300 hidden sm:inline">
                  {user.name || user.email}
                </span>
                <form action="/api/auth/signout" method="POST">
                  <Button type="submit" variant="outline" size="sm" className="text-[#FFCC00] border-[#FFCC00]">
                    Uitloggen
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Inloggen
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
