import { Quote as QuoteIcon } from "lucide-react";
import { Quote } from "../types";

interface QuotesListProps {
  quotes: Quote[];
  isLoading: boolean;
}

export default function QuotesList({ quotes, isLoading }: QuotesListProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-30">
        <QuoteIcon className="animate-pulse text-blue-600" size={70} />
      </div>
    )
  }

  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className="max-h-[calc(100vh-360px)] bg-white rounded-lg shadow-md p-6 mb-8 overflow-y-auto" >
      <ul className="divide-y divide-gray-200">
        {quotes.map((quote) => (
          <li key={quote.id} className="py-4 text-left">
            <div className="space-y-2">
              <div className="text-lg leading-6 font-medium space-y-1">
                <blockquote className="text-xl italic font-semibold text-gray-900"><p>"{quote.body}"</p></blockquote>
                <p className="text-sm text-gray-500">{quote.author}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}