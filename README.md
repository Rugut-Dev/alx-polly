# PollApp - Next.js Polling Application

A modern polling application built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

- **User Authentication**: Login, registration, and profile management
- **Poll Creation**: Create polls with multiple options and descriptions
- **Poll Viewing**: Browse and participate in community polls
- **Real-time Results**: Visual poll results with vote counts and percentages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Beautiful components built with Shadcn UI

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Login page
│   │   ├── register/page.tsx     # Registration page
│   │   └── profile/page.tsx      # User profile page
│   ├── polls/                    # Poll-related pages
│   │   ├── list/page.tsx         # Browse all polls
│   │   ├── create/page.tsx       # Create new poll
│   │   └── view/[id]/page.tsx    # View specific poll
│   ├── components/               # App-specific components
│   ├── lib/                      # App-specific utilities
│   ├── types/                    # App-specific types
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── profile-form.tsx
│   ├── polls/                    # Poll-related components
│   │   ├── polls-list.tsx
│   │   ├── create-poll-form.tsx
│   │   └── poll-view.tsx
│   ├── layout/                   # Layout components
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   └── ui/                       # Shadcn UI components
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client functions
│   ├── validations.ts            # Form validation schemas
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Authentication types
│   └── poll.ts                   # Poll-related types
└── public/                       # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Font**: Geist Sans & Geist Mono

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The project uses Shadcn UI components for a consistent and modern design:

- **Button** - Various button styles and sizes
- **Card** - Content containers with headers and descriptions
- **Input** - Form input fields
- **Label** - Form labels
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Dropdown menus
- **Navigation Menu** - Navigation components
- **Form** - Form handling components

## 🔧 Configuration

### Shadcn UI
The project is configured with Shadcn UI. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Tailwind CSS
Tailwind CSS is configured with custom colors and utilities. The configuration can be found in `tailwind.config.js`.

## 📝 TODO

- [ ] Implement authentication API endpoints
- [ ] Add database integration
- [ ] Implement real-time poll updates
- [ ] Add poll analytics and insights
- [ ] Implement user roles and permissions
- [ ] Add poll categories and tags
- [ ] Implement poll sharing functionality
- [ ] Add email notifications
- [ ] Implement poll expiration
- [ ] Add advanced poll settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.