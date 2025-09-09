import { PollsList } from "@/components/polls/polls-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PollsListPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
            <p className="mt-2 text-gray-600">
              Discover and participate in community polls
            </p>
          </div>
          <Link href="/polls/create">
            <Button>Create New Poll</Button>
          </Link>
        </div>
        <PollsList />
      </div>
    </div>
  )
}