"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Poll } from "@/types/poll"

export function PollsList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch polls from API
    const mockPolls: Poll[] = [
      {
        id: "1",
        title: "What's your favorite programming language?",
        description: "Help us understand the community's preferences",
        options: ["JavaScript", "Python", "TypeScript", "Rust"],
        votes: [45, 32, 28, 15],
        totalVotes: 120,
        createdAt: new Date("2024-01-15"),
        author: "John Doe"
      },
      {
        id: "2",
        title: "Best framework for web development?",
        description: "Share your experience with different frameworks",
        options: ["React", "Vue", "Angular", "Svelte"],
        votes: [60, 25, 20, 10],
        totalVotes: 115,
        createdAt: new Date("2024-01-14"),
        author: "Jane Smith"
      }
    ]
    
    setTimeout(() => {
      setPolls(mockPolls)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {polls.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a poll!</p>
            <Link href="/polls/create">
              <Button>Create Poll</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        polls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">
                <Link 
                  href={`/polls/view/${poll.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {poll.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {poll.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>By {poll.author}</span>
                <span>{poll.totalVotes} votes</span>
                <span>{poll.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{option}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(poll.votes[index] / poll.totalVotes) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {poll.votes[index]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}