import React, { useState } from 'react';
import './index.css';
import {
  Header,
  QueryForm,
  StructuredResponse,
  Footer,
  SamplePrompts,
} from './components';
import { useQuery } from './hooks';

const App: React.FC = () => {
  const { response, isLoading, error, submitQuery } = useQuery();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const handleSamplePromptClick = (prompt: string): void => {
    setSelectedPrompt(prompt);
    setCurrentQuery(prompt);
    // Clear the selected prompt after setting it so it can be set again
    setTimeout(() => setSelectedPrompt(''), 500);
  };

  const handleSubmit = (query: string): void => {
    setCurrentQuery(query);
    submitQuery(query);
  };

  // Show sample prompts only when there is no response and no error 
  const showSamplePrompts = !response && !error;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 robot-bg">
      <Header />

      <section className="w-full max-w-md">
        <QueryForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          externalInputValue={selectedPrompt}
        />
        <SamplePrompts
          onPromptClick={handleSamplePromptClick}
          isLoading={isLoading}
          showSamplePrompts={showSamplePrompts}
        />
        <StructuredResponse
          error={error}
          response={response}
          query={currentQuery}
        />
      </section>

      <Footer />
    </main>
  );
};

export default App;
