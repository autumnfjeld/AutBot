import { useState } from 'react'
import { API_BASE } from '../config.js'

function useQuery() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const submitQuery = async (query) => {
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      
      setResponse(data.response)
    } catch (err) {
      setError(err.message)
      setResponse('') // Clear previous response on error
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError('')
  }

  return {
    response,
    isLoading,
    error,
    submitQuery,
    clearError
  }
}

export default useQuery 