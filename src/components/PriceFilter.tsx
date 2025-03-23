
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/constants";
import { useState, useEffect } from "react";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

const PriceFilter = ({ minPrice, maxPrice, onChange }: PriceFilterProps) => {
  const [localMin, setLocalMin] = useState(minPrice.toString());
  const [localMax, setLocalMax] = useState(maxPrice.toString());
  
  useEffect(() => {
    setLocalMin(minPrice.toString());
    setLocalMax(maxPrice.toString());
  }, [minPrice, maxPrice]);
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMin(value);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMax(value);
  };
  
  const handleBlur = () => {
    const min = localMin === '' ? 0 : parseInt(localMin);
    const max = localMax === '' ? 0 : parseInt(localMax);
    
    // Ensure min is not greater than max
    const validMin = min > max && max !== 0 ? max : min;
    const validMax = max < min ? min : max;
    
    setLocalMin(validMin.toString());
    setLocalMax(validMax.toString());
    onChange(validMin, validMax);
  };
  
  const handleApply = () => {
    const min = localMin === '' ? 0 : parseInt(localMin);
    const max = localMax === '' ? 0 : parseInt(localMax);
    
    // Ensure min is not greater than max
    const validMin = min > max && max !== 0 ? max : min;
    const validMax = max < min ? min : max;
    
    setLocalMin(validMin.toString());
    setLocalMax(validMax.toString());
    onChange(validMin, validMax);
  };
  
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Ценовой диапазон</span>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={localMin}
            onChange={handleMinChange}
            onBlur={handleBlur}
            placeholder="от"
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          />
          <span className="absolute right-3 top-2 text-gray-400 text-sm">₸</span>
        </div>
        <span className="text-gray-400">—</span>
        <div className="relative flex-1">
          <input
            type="text"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={handleBlur}
            placeholder="до"
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          />
          <span className="absolute right-3 top-2 text-gray-400 text-sm">₸</span>
        </div>
      </div>
      <button
        onClick={handleApply}
        className="w-full py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors"
      >
        Применить
      </button>
    </div>
  );
};

export default PriceFilter;
