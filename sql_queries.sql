-- SQL запросы для проверки структуры таблиц

-- 1. Вывести все колонки таблицы clients с их типами
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'clients'
ORDER BY ordinal_position;

-- 2. Вывести все данные из таблицы clients
SELECT * FROM public.clients;

-- 3. Вывести структуру таблицы coaches
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'coaches'
ORDER BY ordinal_position;

-- 4. Вывести структуру таблицы admin_users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
ORDER BY ordinal_position;

