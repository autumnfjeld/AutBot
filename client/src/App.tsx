import React, { useState } from 'react';
import './index.css';
import { Header, QueryForm, StructuredResponse, Footer, SamplePrompts } from './components';
import { useQuery } from './hooks';

const App: React.FC = () => {
  const { response, isLoading, error, submitQuery } = useQuery();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [hasUsedSamplePrompt, setHasUsedSamplePrompt] = useState<boolean>(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const handlePromptClick = (prompt: string): void => {
    setSelectedPrompt(prompt);
    setHasUsedSamplePrompt(true);
    setCurrentQuery(prompt);
    // Clear the selected prompt after setting it so it can be set again
    setTimeout(() => setSelectedPrompt(''), 100);
  };

  const handleSubmit = (query: string): void => {
    setCurrentQuery(query);
    submitQuery(query);
  };

  // Hide sample prompts if user used one and there's a response or error
  const shouldShowSamplePrompts = !hasUsedSamplePrompt || (!response && !error);

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
          onPromptClick={handlePromptClick} 
          isLoading={isLoading}
          shouldShow={shouldShowSamplePrompts}
        />
        <StructuredResponse error={error} response={response} query={currentQuery} />
      </section>

      <Footer />
    </main>
  );
};

export default App;
