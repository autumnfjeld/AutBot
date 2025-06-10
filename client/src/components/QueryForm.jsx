import { useState } from 'react'

function QueryForm({ onSubmit, isLoading }) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    onSubmit(inputValue)
    setInputValue('') // Clear input after submission
  }

  return (
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
  )
}

export default QueryForm 