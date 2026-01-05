import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdkbbggsbbkabycdmtdr.supabase.co'
// Используем service_role key для обхода RLS (только на сервере!)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Создаём клиент с service_role key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username.trim())
      .eq('password', password.trim())

    if (error) {
      console.error('Ошибка запроса к базе данных:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка базы данных' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    const user = data[0]

    return NextResponse.json({
      success: true,
      username: user.username
    })
  } catch (error) {
    console.error('Ошибка авторизации:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

