import { useState } from "react"
import { getQuotesApi } from "./api/api"
import QuotesForm from "./components/QuotesForm"
import QuotesList from "./components/QuotesList"
import { Quote } from "./types"

function App() {

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  async function onFormSubmit(count: number, tag?: string) {

    setError('')

    try {
      setIsLoading(true)
      const data = await getQuotesApi(count, tag)
      setQuotes(data)
    } catch (error) {
      setError('Failed to fetch quotes')
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quotes of the Day
          </h1>
          <p className="text-gray-600">
            Discover inspiring quotes from various authors
          </p>
          <div className="mt-4">
            <QuotesForm onSubmit={onFormSubmit} isLoading={isLoading} error={error} />
            <QuotesList quotes={quotes} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
