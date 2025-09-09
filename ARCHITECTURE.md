# PollApp Architecture Design

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │    Supabase     │    │     Vercel      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│  (Deployment)   │
│                 │    │                 │    │                 │
│ • App Router    │    │ • PostgreSQL    │    │ • Edge Runtime  │
│ • Server Comps  │    │ • Auth          │    │ • CDN           │
│ • API Routes    │    │ • Real-time     │    │ • Analytics     │
│ • Client Comps  │    │ • Storage       │    │ • Functions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Next.js Project Structure

### Recommended App Router Structure
```
app/
├── (auth)/                    # Auth route group
│   ├── login/
│   ├── register/
│   └── profile/
├── (dashboard)/               # Protected route group
│   ├── dashboard/
│   ├── my-polls/
│   └── settings/
├── polls/
│   ├── [id]/
│   │   ├── page.tsx          # Poll view
│   │   └── vote/
│   │       └── page.tsx      # Vote page
│   ├── create/
│   └── list/
├── api/                       # API Routes
│   ├── auth/
│   ├── polls/
│   ├── votes/
│   └── qr/
├── globals.css
├── layout.tsx
└── page.tsx
```

### Component Architecture
```
components/
├── auth/                      # Authentication components
├── polls/                     # Poll-specific components
├── ui/                        # Shadcn UI components
├── layout/                    # Layout components
├── providers/                 # Context providers
│   ├── auth-provider.tsx
│   ├── supabase-provider.tsx
│   └── realtime-provider.tsx
└── hooks/                     # Custom hooks
    ├── use-auth.ts
    ├── use-polls.ts
    └── use-realtime.ts
```

## 🗄️ Supabase Database Schema

### Core Tables
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls table
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

-- Poll options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES public.profiles(id),
  ip_address INET, -- For anonymous voting
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, voter_id) -- Prevent duplicate votes per user
);

-- Poll analytics table
CREATE TABLE public.poll_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Polls policies
CREATE POLICY "Public polls are viewable by everyone" ON public.polls
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own polls" ON public.polls
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Votes policies
CREATE POLICY "Anyone can vote on public polls" ON public.votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE id = poll_id AND is_public = true
    )
  );
```

## 🔐 Authentication Strategy

### Supabase Auth Integration
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies })
}
```

### Auth Provider Implementation
```typescript
// components/providers/auth-provider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Implementation with Supabase auth
}
```

## ⚡ Real-time Features

### Real-time Voting Updates
```typescript
// hooks/use-realtime-votes.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export const useRealtimeVotes = (pollId: string) => {
  const [votes, setVotes] = useState<Record<string, number>>({})

  useEffect(() => {
    const channel = supabase
      .channel(`poll-${pollId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`
      }, (payload) => {
        // Update vote counts in real-time
        updateVoteCounts(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pollId])

  return votes
}
```

## 📱 QR Code Implementation

### QR Code Generation
```typescript
// lib/qr-code.ts
import QRCode from 'qrcode'
import { generateQRCodeData } from './utils'

export const generatePollQRCode = async (pollId: string): Promise<string> => {
  const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL}/polls/${pollId}`
  const qrData = generateQRCodeData(pollUrl)
  
  return await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })
}
```

### QR Code Scanning
```typescript
// components/qr-scanner.tsx
'use client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useRef } from 'react'

export const QRScanner = ({ onScan }: { onScan: (result: string) => void }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { qrbox: { width: 250, height: 250 } },
      false
    )

    scannerRef.current.render(onScan, onError)

    return () => {
      scannerRef.current?.clear()
    }
  }, [])

  return <div id="qr-reader"></div>
}
```

## 🚀 API Routes Structure

### Poll API Routes
```typescript
// app/api/polls/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options(*),
      profiles(username, full_name)
    `)
    .eq('is_public', true)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(polls)
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Create poll with options in a transaction
  const { data: poll, error } = await supabase
    .from('polls')
    .insert({
      title: body.title,
      description: body.description,
      author_id: user.id,
      expires_at: body.expiresAt
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Insert poll options
  const options = body.options.map((text: string, index: number) => ({
    poll_id: poll.id,
    text,
    order_index: index
  }))

  await supabase.from('poll_options').insert(options)

  return NextResponse.json(poll)
}
```

## 🛠️ Recommended Tools & Libraries

### Core Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/auth-helpers-react": "^0.4.2",
    "qrcode": "^1.5.3",
    "html5-qrcode": "^2.3.8",
    "react-qr-code": "^2.0.12",
    "framer-motion": "^10.16.16",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^3.0.6",
    "recharts": "^2.8.0"
  }
}
```

### Development Tools
```json
{
  "devDependencies": {
    "@types/qrcode": "^1.5.5",
    "supabase": "^1.123.4",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

## 🔧 Environment Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## 📊 Performance Optimizations

### Database Optimizations
- Use database indexes on frequently queried columns
- Implement connection pooling
- Use Supabase Edge Functions for heavy computations
- Cache frequently accessed data with Redis

### Frontend Optimizations
- Implement React.memo for expensive components
- Use Next.js Image optimization
- Implement virtual scrolling for large poll lists
- Use Suspense boundaries for better loading states

### CDN & Caching
- Leverage Vercel's Edge Network
- Implement ISR for poll pages
- Use Supabase CDN for static assets
- Cache API responses with appropriate headers

## 🔒 Security Considerations

### Data Protection
- Implement rate limiting on API routes
- Use CSRF protection
- Validate all inputs with Zod schemas
- Implement proper error handling

### Authentication Security
- Use Supabase RLS policies
- Implement session management
- Add 2FA support
- Monitor for suspicious activities

## 📈 Scalability Strategy

### Horizontal Scaling
- Use Supabase's auto-scaling capabilities
- Implement database read replicas
- Use Vercel's edge functions for global distribution
- Implement proper caching strategies

### Monitoring & Analytics
- Use Vercel Analytics for performance monitoring
- Implement Supabase monitoring
- Add error tracking with Sentry
- Monitor database performance metrics