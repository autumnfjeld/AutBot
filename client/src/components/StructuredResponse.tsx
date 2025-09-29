import React from 'react';

interface StructuredResponseProps {
  response?: string;
  error?: string;
  query?: string;
}

interface ParsedResponse {
  summary?: string;
  details?: string;
  fun_facts?: string;
}

interface QueryDisplayProps {
  query?: string;
}

const QueryDisplay: React.FC<QueryDisplayProps> = ({ query }) => {
  if (!query) return null;

  return (
    <div className="mb-3">
      <div className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">
        You asked
      </div>
      <div className="text-stone-700 font-normal italic leading-relaxed">
        {query}
      </div>
    </div>
  );
};

const StructuredResponse: React.FC<StructuredResponseProps> = ({
  response,
  error,
  query,
}) => {
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  // Try to parse JSON response
  let parsedResponse: ParsedResponse;
  try {
    parsedResponse = JSON.parse(response);
  } catch {
    // If not JSON, display as plain text
    return (
      <div className="mt-6">
        <QueryDisplay query={query} />
        <div className="p-4 bg-stone-100 border border-stone-200 rounded-md shadow-sm">
          <p className="text-stone-700 whitespace-pre-wrap">{response}</p>
        </div>
      </div>
    );
  }

  const { summary, details, fun_facts } = parsedResponse;

  return (
    <div className="mt-6">
      <QueryDisplay query={query} />
      <div className="p-4 bg-stone-100 border border-stone-200 rounded-md shadow-sm">
        <div className="space-y-4">
          {/* Summary Section - no title */}
          {summary && (
            <p className="text-stone-700 font-normal text-md leading-relaxed">
              {summary}
            </p>
          )}

          {/* Details Section */}
          {details && (
            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Experience
              </h3>
              <div className="text-stone-700 space-y-2">
                {details.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Fun Facts Section */}
          {fun_facts && (
            <div>
              <h3 className="text-sm font-semibold text-lime-900 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Fun Facts
              </h3>
              <p className="text-lime-900 italic">{fun_facts}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructuredResponse;
