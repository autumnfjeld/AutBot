import React from 'react';
import RobotIcon from '../assets/RobotIcon';

interface SamplePromptsProps {
  onPromptClick: (prompt: string) => void;
  isLoading: boolean;
  shouldShow?: boolean;
}

const SamplePrompts: React.FC<SamplePromptsProps> = ({
  onPromptClick,
  isLoading,
  shouldShow = true,
}) => {
  const samplePrompts = [
    'How does Autumn navigate ambiguity?',
    'What challenging problems has Autumn worked on?',
    "Tell me about Autumn's leadership experience.",
    "Summarize Autumn's work history and achievements.",
  ];

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm text-stone-600 text-center mb-3">Try asking:</p>
      <div className="grid grid-cols-1 gap-2">
        {samplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            disabled={isLoading}
            className={`p-3 text-sm text-left rounded-md border transition-colors flex items-start ${
              isLoading
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-800 cursor-pointer'
            }`}
          >
            <RobotIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SamplePrompts;
