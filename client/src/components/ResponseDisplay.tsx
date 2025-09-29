import React from 'react';

interface ResponseDisplayProps {
  error?: string;
  response?: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  error,
  response,
}) => {
  if (!error && !response) {
    return null;
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {response && (
        <div className="p-4 bg-stone-100 border border-stone-200 rounded-md shadow-sm">
          <p className="text-stone-700">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
