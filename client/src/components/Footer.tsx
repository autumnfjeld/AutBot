import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 w-full max-w-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/autumnfjeld/AutBot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sky-700 hover:text-sky-900 transition-colors"
          >
            <span className="text-sm font-medium">AutBot on GitHub</span>
          </a>
          <a
            href="http://autumnfjeld.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
          >
            autumnfjeld.com
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="public/AutumnFjeld_Resume_20250527.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-lime-700 hover:text-lime-900 transition-colors"
          >
            Old fashioned resume
          </a>
        </div>
        <div className="text-xs text-stone-500">
          © {new Date().getFullYear()} Autumn Fjeld
        </div>
      </div>
    </footer>
  );
};

export default Footer;
