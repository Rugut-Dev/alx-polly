export interface Poll {
  id: string
  title: string
  description: string
  options: string[]
  votes: number[]
  totalVotes: number
  createdAt: Date
  author: string
  authorId?: string
  isActive?: boolean
  expiresAt?: Date
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
}

export interface VoteData {
  pollId: string
  optionIndex: number
}