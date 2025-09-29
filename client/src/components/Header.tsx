import React from 'react';
import autLogo from '../assets/aut-cartoon-from-miami.png';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-heading mb-4 text-sky-700">The Aut Bot</h1>
      <a
        href="http://autumnfjeld.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <img
          src={autLogo}
          className="h-48 rounded-full border-3 border-lime-700 hover:border-lime-900 transition-colors opacity-60"
          alt="AutBot logo"
        />
      </a>
      <p className="text-stone-600 mt-4">Autumn's interactive resume.</p>
    </header>
  );
};

export default Header;
