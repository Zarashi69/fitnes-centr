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
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ошибка загрузки клиентов:', error)
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
    console.error('Ошибка при загрузке клиентов:', error)
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

    const clientData = await request.json()

    if (!clientData.full_name) {
      return NextResponse.json(
        { success: false, error: 'Полное имя обязательно' },
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
      .from('clients')
      .insert([clientData])
      .select()

    if (error) {
      console.error('Ошибка добавления клиента:', error)
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
    console.error('Ошибка при добавлении клиента:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

