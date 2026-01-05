import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdkbbggsbbkabycdmtdr.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!supabaseServiceKey) {
  console.error('ОШИБКА: SUPABASE_SERVICE_ROLE_KEY или SUPABASE_KEY не настроены!')
}

export async function GET() {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Ошибка конфигурации сервера' },
        { status: 500 }
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
      .from('coaches')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Ошибка загрузки тренеров:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка базы данных' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Ошибка при загрузке тренеров:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      )
    }

    const coachData = await request.json()

    if (!coachData.name) {
      return NextResponse.json(
        { success: false, error: 'Имя обязательно' },
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
      .from('coaches')
      .insert([coachData])
      .select()

    if (error) {
      console.error('Ошибка добавления тренера:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка базы данных' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Ошибка при добавлении тренера:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

