#!/bin/bash

echo "🚀 PollApp Environment Setup"
echo "=============================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
# Replace these with your actual Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: For production
# NEXT_PUBLIC_VERCEL_URL=your_vercel_deployment_url
EOF

echo "✅ Created .env.local file"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Create a new project or select existing project"
echo "3. Go to Settings > API"
echo "4. Copy your Project URL and anon key"
echo "5. Update .env.local with your actual credentials"
echo ""
echo "🔧 To get your credentials:"
echo "   - Project URL: https://your-project-ref.supabase.co"
echo "   - anon key: Your public anon key from API settings"
echo "   - service_role key: Your service role key (keep secret!)"
echo ""
echo "⚠️  Remember: Never commit .env.local to git!"
echo ""
echo "After updating .env.local, restart your dev server:"
echo "   npm run dev"