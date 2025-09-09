import { CreatePollForm } from "@/components/polls/create-poll-form"

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
          <p className="mt-2 text-gray-600">
            Share your question with the community
          </p>
        </div>
        <CreatePollForm />
      </div>
    </div>
  )
}