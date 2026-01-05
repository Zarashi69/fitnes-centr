import { AdminUser } from '../types'

const AUTH_KEY = 'fitness_admin_auth'

export const auth = {
  // Проверка авторизации через admin_users (через API route для обхода RLS)
  async login(username: string, password: string): Promise<boolean> {
    try {
      const trimmedUsername = username.trim()
      const trimmedPassword = password.trim()

      if (!trimmedUsername || !trimmedPassword) {
        return false
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        console.error('Ошибка авторизации:', result.error)
        return false
      }

      // Сохраняем сессию в localStorage
      const sessionData = {
        username: result.username,
        timestamp: Date.now(),
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      return true
    } catch (error) {
      console.error('Ошибка авторизации:', error)
      return false
    }
  },

  // Проверка текущей сессии
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const session = localStorage.getItem(AUTH_KEY)
    if (!session) return false

    try {
      const sessionData = JSON.parse(session)
      // Проверяем, что сессия не старше 7 дней
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - sessionData.timestamp > sevenDays) {
        localStorage.removeItem(AUTH_KEY)
        return false
      }
      return true
    } catch {
      return false
    }
  },

  // Выход
  logout(): void {
    localStorage.removeItem(AUTH_KEY)
  },

  // Получить текущего пользователя
  getCurrentUser(): string | null {
    if (typeof window === 'undefined') return null
    
    const session = localStorage.getItem(AUTH_KEY)
    if (!session) return null

    try {
      const sessionData = JSON.parse(session)
      return sessionData.username || null
    } catch {
      return null
    }
  },
}

