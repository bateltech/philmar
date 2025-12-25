'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDownAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';

type SortMode = 'recent' | 'old' | 'alpha';

type FilterDropdownProps = {
  value: SortMode;
  onChange: (mode: SortMode) => void;
};


const FilterDropdown = ({  value, onChange }: FilterDropdownProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const labelMap: Record<SortMode, string> = {
    recent: 'Les plus récents',
    old: 'Les plus anciens',
    alpha: 'Ordre alphabétique',
  };

  const currentLabel = labelMap[value];


  return (
    <div className="relative inline-block text-white">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between px-4 py-2 border border-white w-48 space-x-2 transition-colors duration-200 hover:bg-blue-950 hover:border-blue-950"
      >
        <FontAwesomeIcon icon={faSortAmountDownAlt} />
        <span className="ml-2">{currentLabel}</span>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-700 shadow-lg z-20">
          <ul className="text-black text-left">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => { onChange('recent'); setIsOpen(false); }} > Les plus récents </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => { onChange('old'); setIsOpen(false); }} > Les plus anciens </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => { onChange('alpha'); setIsOpen(false); }}> Ordre alphabétique </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
