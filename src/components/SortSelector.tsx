
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ChevronDown } from "lucide-react";

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelector = ({ value, onChange }: SortSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: "date-desc", label: "Сначала новые" },
    { value: "date-asc", label: "Сначала старые" },
    { value: "price-asc", label: "Сначала дешевые" },
    { value: "price-desc", label: "Сначала дорогие" },
  ];
  
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-left"
      >
        <div className="flex items-center">
          <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
          <span className="block truncate text-sm">{selectedOption.label}</span>
        </div>
        <ChevronDown className={cn(
          "ml-2 h-4 w-4 transition-transform duration-200 text-gray-500", 
          isOpen ? "transform rotate-180" : ""
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200 animate-fade-in">
          <ul className="py-1">
            {options.map((option) => (
              <li 
                key={option.value}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm", 
                  value === option.value ? "bg-brand/10 text-brand" : ""
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortSelector;
