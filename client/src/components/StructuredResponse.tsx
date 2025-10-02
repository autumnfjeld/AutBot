import React from 'react';
import ListIcon from '../assets/ListIcon';
import PlayIcon from '../assets/PlayIcon';

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
                <ListIcon className="w-5 h-5 mr-2 mb-0.5" />
                Experience
              </h3>
              <div className="text-stone-700 space-y-2">
                {details.split('\n\n').map((paragraph, index) => (
                  // eslint-disable-next-line react/jsx-max-props-per-line
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
                <PlayIcon className="w-5 h-5 mr-2 mb-0.5" />
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
