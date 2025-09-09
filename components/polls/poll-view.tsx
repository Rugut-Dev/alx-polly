"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"

interface PollViewProps {
  pollId: string
}

export function PollView({ pollId }: PollViewProps) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch poll data by ID
    const mockPoll: Poll = {
      id: pollId,
      title: "What's your favorite programming language?",
      description: "Help us understand the community's preferences for programming languages in 2024.",
      options: ["JavaScript", "Python", "TypeScript", "Rust", "Go"],
      votes: [45, 32, 28, 15, 12],
      totalVotes: 132,
      createdAt: new Date("2024-01-15"),
      author: "John Doe"
    }
    
    setTimeout(() => {
      setPoll(mockPoll)
      setIsLoading(false)
    }, 1000)
  }, [pollId])

  const handleVote = async () => {
    if (selectedOption === null) return
    
    // TODO: Submit vote to API
    console.log("Voting for option:", selectedOption)
    
    // Simulate vote submission
    setHasVoted(true)
    if (poll) {
      const newVotes = [...poll.votes]
      newVotes[selectedOption]++
      setPoll({
        ...poll,
        votes: newVotes,
        totalVotes: poll.totalVotes + 1
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!poll) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Poll not found</h3>
          <p className="text-gray-600">The poll you're looking for doesn't exist.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>By {poll.author}</span>
          <span>{poll.totalVotes} votes</span>
          <span>{poll.createdAt.toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        {!hasVoted ? (
          <div className="space-y-4">
            <h3 className="font-medium">Select your answer:</h3>
            {poll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="poll-option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
            <Button 
              onClick={handleVote} 
              disabled={selectedOption === null}
              className="w-full mt-6"
            >
              Submit Vote
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Poll Results:</h3>
            {poll.options.map((option, index) => {
              const percentage = poll.totalVotes > 0 
                ? (poll.votes[index] / poll.totalVotes) * 100 
                : 0
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{option}</span>
                    <span className="text-sm text-gray-600">
                      {poll.votes[index]} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Thank you for voting! Your response has been recorded.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}