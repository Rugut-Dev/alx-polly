import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PollApp</h3>
            <p className="text-gray-600 mb-4">
              Create and participate in community polls. Share your opinions and discover what others think.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/polls/list" className="hover:text-gray-900">Browse Polls</Link></li>
              <li><Link href="/polls/create" className="hover:text-gray-900">Create Poll</Link></li>
              <li><Link href="/auth/profile" className="hover:text-gray-900">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/auth/login" className="hover:text-gray-900">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-gray-900">Sign Up</Link></li>
              <li><Link href="/auth/profile" className="hover:text-gray-900">Settings</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © 2024 PollApp. Built with Next.js and Shadcn UI.
          </p>
        </div>
      </div>
    </footer>
  )
}