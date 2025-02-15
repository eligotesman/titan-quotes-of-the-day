
import { useState } from "react";

interface QuotesFormProps {
  onSubmit: (count: number, tag?: string) => void;
  isLoading: boolean;
  error: string;
}

export default function QuotesForm({ onSubmit, isLoading, error }: QuotesFormProps) {

  const [inputs, setInputs] = useState({
    count: "",
    tag: "",
  });

  function onFormSubmit() {
    onSubmit(parseInt(inputs.count), inputs.tag);
  }


  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      onFormSubmit()
    }}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">

          <div className="flex-1 text-left">
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Quotes
              <span className="text-xs"> (50 Max.)</span>
            </label>
            <input
              type="number"
              id="count"
              min="1"
              max="50"
              value={inputs.count}
              onChange={(e) => setInputs({ ...inputs, count: e.target.value })}
              className="w-full p-2 rounded-md border-1 border-gray-300 shadow-sm focus:outline-none"
            />
          </div>
          <div className="flex-1 text-left">
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <input
              id="tag"
              value={inputs.tag}
              onChange={(e) => setInputs({ ...inputs, tag: e.target.value })}
              className="w-full p-2 rounded-md border-1 border-gray-300 shadow-sm focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading || !inputs.count}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md enabled:hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-auto"
            >
              Get Quotes
            </button>

          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 text-left">{error}</p>}
      </div>
    </form>
  );
}