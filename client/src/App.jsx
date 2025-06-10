import './index.css'
import { Header, QueryForm, ResponseDisplay, Footer } from './components'
import { useQuery } from './hooks'

function App() {
  const { response, isLoading, error, submitQuery } = useQuery()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 robot-bg">
      <Header />

      <section className="w-full max-w-md">
        <QueryForm onSubmit={submitQuery} isLoading={isLoading} />
        <ResponseDisplay error={error} response={response} />
      </section>

      <Footer />
    </main>
  )
}

export default App
