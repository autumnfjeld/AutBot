import { useState } from 'react'
import autLogo from './assets/aut-sticker.jpg'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      
      setResponse(data.response)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex space-x-4 mb-6">
        <a href="http://autumnfjeld.com" target="_blank">
          <img src={autLogo} className="h-12" alt="Vite logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-6">Aut Bot</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask aut anything..."
            className="p-3 border rounded-md text-lg"
          />
          <button 
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`p-3 text-white text-lg font-medium rounded-md ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {response && (
          <div className="mt-6 p-4 bg-indigo-100 rounded-md">
            <p>{response}</p>
          </div>
        )}
      </div>
      <p className="mt-8 text-gray-500">Ask aut anything.</p>
    </div>
  )
}

export default App
