
import { CATEGORIES } from "@/utils/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

const CategoryFilter = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCategoryObj = CATEGORIES.find(cat => cat.id === selectedCategory);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    onSubcategoryChange("");
    setIsOpen(false);
  };
  
  const handleSubcategorySelect = (subcategory: string) => {
    onSubcategoryChange(subcategory);
  };
  
  const displayText = selectedCategory 
    ? selectedCategoryObj?.name 
    : "Все категории";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-left"
      >
        <span className="block truncate">{displayText}</span>
        <ChevronDown className={cn(
          "ml-2 h-4 w-4 transition-transform duration-200", 
          isOpen ? "transform rotate-180" : ""
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200 animate-fade-in">
          <ul className="py-1">
            <li 
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-gray-100", 
                !selectedCategory ? "bg-brand/10 text-brand" : ""
              )}
              onClick={() => handleCategorySelect("")}
            >
              Все категории
            </li>
            
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <div 
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-gray-100", 
                    selectedCategory === category.id ? "bg-brand/10 text-brand" : ""
                  )}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </div>
                
                {selectedCategory === category.id && category.subcategories && (
                  <ul className="pl-6 pb-1">
                    <li
                      className={cn(
                        "px-4 py-1 cursor-pointer hover:bg-gray-100 text-sm",
                        !selectedSubcategory ? "text-brand" : ""
                      )}
                      onClick={() => handleSubcategorySelect("")}
                    >
                      Все подкатегории
                    </li>
                    {category.subcategories.map((sub) => (
                      <li
                        key={sub}
                        className={cn(
                          "px-4 py-1 cursor-pointer hover:bg-gray-100 text-sm",
                          selectedSubcategory === sub ? "text-brand" : ""
                        )}
                        onClick={() => handleSubcategorySelect(sub)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
