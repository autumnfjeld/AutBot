import React from 'react';

interface IconProps {
  className?: string;
}

const ListIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={`${className} text-lime-700`}
      fill="currentColor"
      viewBox="0 0 20 14"
    >
      <path
        fillRule="evenodd"
        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default ListIcon;
