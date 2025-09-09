import { PollView } from "@/components/polls/poll-view"
import { notFound } from "next/navigation"

interface PollViewPageProps {
  params: {
    id: string
  }
}

export default function PollViewPage({ params }: PollViewPageProps) {
  // TODO: Validate poll ID and fetch poll data
  if (!params.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PollView pollId={params.id} />
      </div>
    </div>
  )
}