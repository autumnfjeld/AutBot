import { useState } from 'react'
import './index.css'
import { Header, QueryForm, ResponseDisplay, Footer, SamplePrompts } from './components'
import { useQuery } from './hooks'

function App() {
  const { response, isLoading, error, submitQuery } = useQuery()
  const [selectedPrompt, setSelectedPrompt] = useState('')

  const handlePromptClick = (prompt) => {
    setSelectedPrompt(prompt)
    // Clear the selected prompt after setting it so it can be set again
    setTimeout(() => setSelectedPrompt(''), 100)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 robot-bg">
      <Header />

      <section className="w-full max-w-md">
        <QueryForm 
          onSubmit={submitQuery} 
          isLoading={isLoading} 
          externalInputValue={selectedPrompt}
        />
        <SamplePrompts 
          onPromptClick={handlePromptClick} 
          isLoading={isLoading}
        />
        <ResponseDisplay error={error} response={response} />
      </section>

      <Footer />
    </main>
  )
}

export default App
