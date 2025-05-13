import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Aut Bot</h1>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask aut anything..."
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '300px'
            }}
          />
          <button 
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: isLoading ? '#ccc' : '#646cff',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        
        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}
        
        {response && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '##6A5ACD', borderRadius: '4px' }}>
            <p>{response}</p>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Ask aut anything.
      </p>
    </>
  )
}

export default App
