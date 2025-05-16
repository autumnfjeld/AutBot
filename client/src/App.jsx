import { useState } from 'react'
import autLogo from './assets/autbot-2.png'
import './index.css'

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
      const res = await fetch('http://localhost:3001/api/query', {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-200 p-6">
      <h1 className="text-4xl font-heading mb-6 text-sky-700">The Aut Bot</h1>
      <div className="flex space-x-4 mb-6">
        <a href="http://autumnfjeld.com" target="_blank">
          <img src={autLogo} className="h-48 rounded-full border-3 border-lime-700" alt="AutBot logo" />
        </a>
      </div>
      <div className="bg-magnolia shadow-md rounded-lg p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask the AutBot..."
            className="p-3 border-2 border-stone-400 rounded-md text-md"
          />
          <button 
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`p-3 text-white text-lg font-medium rounded-md ${
              isLoading ? ' cursor-not-allowed' : 'bg-lime-700 hover:bg-lime-900'
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
      <p className="mt-8 text-green-700"></p>
      <a href="https://github.com/autumnfjeld/AutBot" target="_blank" className="text-sky-700 hover:text-blue-700">github.com/autumnfjeld/AutBot</a>
    </div>
  )
}

export default App
