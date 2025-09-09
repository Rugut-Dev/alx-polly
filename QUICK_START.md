# 🚀 Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Set up Environment Variables

Run the setup script:
```bash
./setup-env.sh
```

Then edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings > API**
4. Copy your Project URL and anon key
5. Update `.env.local` with these values

### 3. Set up Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polls table
CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES public.profiles(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id)
);

-- Create poll_analytics table
CREATE TABLE public.poll_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public polls are viewable by everyone" ON public.polls
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own polls" ON public.polls
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Anyone can vote on public polls" ON public.votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE id = poll_id AND is_public = true
    )
  );
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🔧 Troubleshooting

### Supabase Connection Errors
- ✅ Check your `.env.local` file has correct credentials
- ✅ Verify your Supabase project is active
- ✅ Ensure you've run the database setup SQL

### 404 Errors on Routes
- ✅ Restart your dev server after setting up environment variables
- ✅ Check that all API routes are properly configured

### Authentication Issues
- ✅ Verify Supabase Auth is enabled in your project
- ✅ Check that RLS policies are set up correctly

## 📚 Next Steps

1. **Test the app**: Create a poll and vote on it
2. **Customize**: Modify the UI and add your branding
3. **Deploy**: Follow the deployment guide in `IMPLEMENTATION_GUIDE.md`
4. **Scale**: Add more features like social auth, analytics, etc.

## 🆘 Need Help?

- Check the full documentation in `ARCHITECTURE.md`
- Review the implementation guide in `IMPLEMENTATION_GUIDE.md`
- Look at the code examples in the components and hooks folders