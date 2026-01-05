'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../lib/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Проверяем авторизацию и перенаправляем
    if (auth.isAuthenticated()) {
      router.push('/admin')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Перенаправление...</div>
    </div>
  )
}