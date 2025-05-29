-- Query to examine table structure and relationships
-- Run these in your Supabase SQL Editor to understand the schema

-- List all tables in the public schema
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public'
ORDER BY
    table_name;

-- Get detailed information about the posts table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'posts'
ORDER BY 
    ordinal_position;

-- Get information about categories table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'categories'
ORDER BY 
    ordinal_position;

-- Get information about post_categories junction table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'post_categories'
ORDER BY 
    ordinal_position;

-- Get information about post_versions table if it exists
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'post_versions'
ORDER BY 
    ordinal_position;

-- List all constraints (primary keys, foreign keys, etc.)
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE
    tc.table_schema = 'public'
    AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
ORDER BY
    tc.table_name,
    tc.constraint_name;

-- Check for RLS policies on posts table
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND tablename IN ('posts', 'categories', 'post_categories', 'post_versions')
ORDER BY
    tablename, policyname;

-- Sample query to understand data structure (limit to 10 rows)
SELECT 
    p.id, 
    p.title, 
    p.description, 
    p.status,
    p.created_at,
    p.updated_at,
    p.published_at,
    p.author_id,
    p.slug,
    string_agg(c.name, ', ') as categories
FROM 
    posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
GROUP BY 
    p.id
ORDER BY 
    p.created_at DESC
LIMIT 10;

-- Check for storage buckets and policies
SELECT 
    name, 
    owner, 
    public,
    file_size_limit,
    allowed_mime_types
FROM 
    storage.buckets
WHERE 
    name = 'post_images';

-- Get trigger information
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM 
    information_schema.triggers
WHERE 
    event_object_schema = 'public'
    AND event_object_table = 'posts';
