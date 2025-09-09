// Validation schemas and functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePollData = (data: {
  title: string
  description?: string
  options: string[]
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.title.trim()) {
    errors.push('Poll title is required')
  }
  
  if (data.title.length > 200) {
    errors.push('Poll title must be less than 200 characters')
  }
  
  if (data.description && data.description.length > 1000) {
    errors.push('Poll description must be less than 1000 characters')
  }
  
  const validOptions = data.options.filter(option => option.trim() !== '')
  
  if (validOptions.length < 2) {
    errors.push('Poll must have at least 2 options')
  }
  
  if (validOptions.length > 10) {
    errors.push('Poll cannot have more than 10 options')
  }
  
  // Check for duplicate options
  const uniqueOptions = new Set(validOptions.map(option => option.toLowerCase()))
  if (uniqueOptions.size !== validOptions.length) {
    errors.push('Poll options must be unique')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateRegistrationData = (data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!data.name.trim()) {
    errors.push('Name is required')
  }
  
  if (data.name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  
  if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address')
  }
  
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors)
  }
  
  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}