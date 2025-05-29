#!/bin/bash

# Add to all environments using the new CLI syntax
echo "aws-0-us-east-1.pooler.supabase.com" | vercel env add DATABASE_HOST production
echo "aws-0-us-east-1.pooler.supabase.com" | vercel env add DATABASE_HOST preview  
echo "aws-0-us-east-1.pooler.supabase.com" | vercel env add DATABASE_HOST development

echo "6543" | vercel env add DATABASE_PORT production
echo "6543" | vercel env add DATABASE_PORT preview
echo "6543" | vercel env add DATABASE_PORT development

echo "postgres.atstqchafgwhfeyjscux" | vercel env add DATABASE_USER production
echo "postgres.atstqchafgwhfeyjscux" | vercel env add DATABASE_USER preview
echo "postgres.atstqchafgwhfeyjscux" | vercel env add DATABASE_USER development

echo "9XpUhU2e2tIBYUhC" | vercel env add DATABASE_PASSWORD production
echo "9XpUhU2e2tIBYUhC" | vercel env add DATABASE_PASSWORD preview
echo "9XpUhU2e2tIBYUhC" | vercel env add DATABASE_PASSWORD development

echo "postgres" | vercel env add DATABASE_NAME production
echo "postgres" | vercel env add DATABASE_NAME preview
echo "postgres" | vercel env add DATABASE_NAME development

echo "https://atstqchafgwhfeyjscux.supabase.co" | vercel env add PUBLIC_SUPABASE_URL production
echo "https://atstqchafgwhfeyjscux.supabase.co" | vercel env add PUBLIC_SUPABASE_URL preview
echo "https://atstqchafgwhfeyjscux.supabase.co" | vercel env add PUBLIC_SUPABASE_URL development

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c3RxY2hhZmd3aGZleWpzY3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzM2NjMsImV4cCI6MjA1ODI0OTY2M30.GuH4UnGVLoqkkQfJInFsTgI7gz_Nwj-OHtOKKHn4mKk" | vercel env add PUBLIC_SUPABASE_ANON_KEY production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c3RxY2hhZmd3aGZleWpzY3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzM2NjMsImV4cCI6MjA1ODI0OTY2M30.GuH4UnGVLoqkkQfJInFsTgI7gz_Nwj-OHtOKKHn4mKk" | vercel env add PUBLIC_SUPABASE_ANON_KEY preview
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c3RxY2hhZmd3aGZleWpzY3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzM2NjMsImV4cCI6MjA1ODI0OTY2M30.GuH4UnGVLoqkkQfJInFsTgI7gz_Nwj-OHtOKKHn4mKk" | vercel env add PUBLIC_SUPABASE_ANON_KEY development

echo "✅ All environment variables added successfully!"
