
import { useEffect, useState } from "react";
import { FilterState, Product } from "@/types";
import { DEFAULT_FILTER_STATE } from "@/utils/constants";
import { getFilteredProducts } from "@/utils/productStore";
import CategoryFilter from "@/components/CategoryFilter";
import PriceFilter from "@/components/PriceFilter";
import ProductCard from "@/components/ProductCard";
import SortSelector from "@/components/SortSelector";
import { Filter, Search } from "lucide-react";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const filtered = getFilteredProducts(
      filters.category,
      filters.subcategory || "",
      filters.priceRange,
      filters.sortBy
    );
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchResults = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
      setProducts(searchResults);
    } else {
      setProducts(filtered);
    }
  }, [filters, searchQuery]);
  
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category, subcategory: "" }));
  };
  
  const handleSubcategoryChange = (subcategory: string) => {
    setFilters(prev => ({ ...prev, subcategory }));
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceRange: { min, max } }));
  };
  
  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as FilterState["sortBy"] }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
    setSearchQuery("");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">OVVO</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFilters}
                className="p-2 text-gray-500 hover:text-brand md:hidden"
              >
                <Filter className="h-5 w-5" />
              </button>
              <a href="/admin" className="text-sm text-gray-500 hover:text-brand">
                Вход для администратора
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters column */}
          <aside className={`md:w-64 space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-medium mb-3">Категории</h2>
              <CategoryFilter
                selectedCategory={filters.category}
                selectedSubcategory={filters.subcategory || ""}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <PriceFilter
                minPrice={filters.priceRange.min}
                maxPrice={filters.priceRange.max}
                onChange={handlePriceChange}
              />
            </div>
            
            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-brand hover:text-brand-dark"
            >
              Сбросить фильтры
            </button>
          </aside>
          
          {/* Products grid */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">Сортировать:</span>
                <SortSelector
                  value={filters.sortBy}
                  onChange={handleSortChange}
                />
              </div>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-empty-cart-4085814-3385483.png"
                  alt="Пустая корзина"
                  className="w-20 h-20 mb-4 opacity-50"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Товары не найдены
                </h3>
                <p className="text-gray-500 max-w-md">
                  Попробуйте изменить параметры фильтрации или поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
