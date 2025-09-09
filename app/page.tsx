import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-blue-600">PollApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create engaging polls, gather community opinions, and discover what others think. 
            Built with Next.js and Shadcn UI for a modern, responsive experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polls/create">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your First Poll
              </Button>
            </Link>
            <Link href="/polls/list">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for polling
          </h2>
          <p className="text-lg text-gray-600">
            Our platform provides all the tools you need to create and manage polls effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Create Polls
              </CardTitle>
              <CardDescription>
                Easily create polls with multiple options and descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multiple choice options</li>
                <li>• Rich descriptions</li>
                <li>• Customizable settings</li>
                <li>• Real-time results</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                Participate
              </CardTitle>
              <CardDescription>
                Vote on polls and see real-time results and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• One-click voting</li>
                <li>• Visual results</li>
                <li>• Vote tracking</li>
                <li>• Community engagement</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                Manage
              </CardTitle>
              <CardDescription>
                Track your polls and manage your account with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• User profiles</li>
                <li>• Poll history</li>
                <li>• Analytics</li>
                <li>• Account settings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the community and start creating polls today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
