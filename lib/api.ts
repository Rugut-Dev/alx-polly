// API utility functions for the polling app

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      response
    )
  }
  
  return response.json()
}

// Poll API functions
export const pollApi = {
  async getPolls(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/polls`)
    return handleResponse(response)
  },

  async getPoll(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`)
    return handleResponse(response)
  },

  async createPoll(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async voteOnPoll(pollId: string, optionIndex: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionIndex }),
    })
    return handleResponse(response)
  }
}

// Auth API functions
export const authApi = {
  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
  },

  async register(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async getProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return handleResponse(response)
  },

  async updateProfile(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  }
}