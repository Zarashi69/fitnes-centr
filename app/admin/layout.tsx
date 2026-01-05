'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { auth } from '../../lib/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Проверяем авторизацию
    if (!auth.isAuthenticated()) {
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [router])

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Проверка авторизации...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/admin"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/admin'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Главная
              </Link>
              <Link
                href="/admin/clients"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/admin/clients'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Клиенты
              </Link>
              <Link
                href="/admin/coaches"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/admin/coaches'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Тренеры
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {auth.getCurrentUser()}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

