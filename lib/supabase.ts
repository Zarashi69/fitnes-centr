import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdkbbggsbbkabycdmtdr.supabase.co'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY

if (!supabaseKey) {
  console.error('Ошибка: переменная окружения SUPABASE_KEY не настроена!')
}

export const supabase = createClient(supabaseUrl, supabaseKey!)