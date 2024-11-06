'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDownAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const FilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-white">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between px-4 py-2 border border-white w-48 space-x-2 transition-colors duration-200 hover:bg-blue-950 hover:border-blue-950"
      >
        <FontAwesomeIcon icon={faSortAmountDownAlt} />
        <span className="ml-2">Trier par</span>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-700 shadow-lg z-20">
          <ul className="text-black text-left">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Les plus récents</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Les plus Anciens</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Ordre alphabétique</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
