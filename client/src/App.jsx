import { useState } from 'react'
import autLogo from './assets/aut-cartoon-from-miami.png'
import './index.css'
import { API_BASE } from './config.js'

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
    if (!inputValue.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${API_BASE}/api/query`, {
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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 robot-bg">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-heading mb-4 text-sky-700">The Aut Bot</h1>
        <a 
          href="http://autumnfjeld.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img 
            src={autLogo} 
            className="h-48 rounded-full border-3 border-lime-700 hover:border-lime-900 transition-colors opacity-60" 
            alt="AutBot logo" 
          />
        </a>
        <p className="text-stone-600 mt-4">Autumn's interactive resume.</p>
      </header>

      <section className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type here to ask the AutBot about Autumn."
              className="w-full p-3 bg-stone-100 border-2 border-stone-400 rounded-md text-md focus:outline-none focus:border-lime-700 transition-colors"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`w-full p-3 text-white text-lg font-medium rounded-md transition-colors ${
              isLoading 
                ? 'bg-stone-400 cursor-not-allowed' 
                : 'bg-lime-700 hover:bg-lime-900'
            }`}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-stone-100 border border-stone-200 rounded-md shadow-sm">
            <p className="text-stone-700">{response}</p>
          </div>
        )}
      </section>

      <footer className="mt-24 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/autumnfjeld/AutBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sky-700 hover:text-sky-900 transition-colors"
            >
      
              <span className="text-sm font-medium">AutBot on GitHub</span>
            </a>
            <a
              href="http://autumnfjeld.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
            >
              autumnfjeld.com
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <a
              // href={`${API_BASE}/api/resume`}
              href="public/AutumnFjeld_Resume_20250527.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-lime-700 hover:text-lime-900 transition-colors"
            >
              Old fashioned resume
            </a>
          </div>
          <div className="text-xs text-stone-500">
            © {new Date().getFullYear()} Autumn Fjeld
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
