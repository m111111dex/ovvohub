
import { CATEGORIES } from "@/utils/constants";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "px-3 py-2 cursor-pointer rounded-lg transition-colors",
          !selectedCategory ? "bg-brand/10 text-brand font-medium" : "hover:bg-gray-100"
        )}
        onClick={() => onCategoryChange("")}
      >
        Все категории
      </div>
      
      {CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-1">
          <div 
            className={cn(
              "px-3 py-2 cursor-pointer rounded-lg transition-colors", 
              selectedCategory === category.id ? "bg-brand/10 text-brand font-medium" : "hover:bg-gray-100"
            )}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </div>
          
          {selectedCategory === category.id && category.subcategories && (
            <div className="pl-4 space-y-1">
              <div
                className={cn(
                  "px-3 py-1 cursor-pointer rounded-lg text-sm transition-colors",
                  !selectedSubcategory ? "text-brand font-medium" : "hover:bg-gray-100"
                )}
                onClick={() => onSubcategoryChange("")}
              >
                Все подкатегории
              </div>
              {category.subcategories.map((sub) => (
                <div
                  key={sub}
                  className={cn(
                    "px-3 py-1 cursor-pointer rounded-lg text-sm transition-colors",
                    selectedSubcategory === sub ? "text-brand font-medium" : "hover:bg-gray-100"
                  )}
                  onClick={() => onSubcategoryChange(sub)}
                >
                  {sub}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
