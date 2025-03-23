
import { Product } from "@/types";
import { STORAGE_KEY } from "./constants";

// Load products from localStorage
export const loadProducts = (): Product[] => {
  const storedProducts = localStorage.getItem(STORAGE_KEY);
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts);
    } catch (error) {
      console.error("Error parsing stored products:", error);
      return [];
    }
  }
  return [];
};

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

// Add a new product
export const addProduct = (product: Product): void => {
  const products = loadProducts();
  products.push(product);
  saveProducts(products);
};

// Update an existing product
export const updateProduct = (product: Product): void => {
  const products = loadProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    saveProducts(products);
  }
};

// Delete a product
export const deleteProduct = (productId: string): void => {
  const products = loadProducts();
  const filteredProducts = products.filter(p => p.id !== productId);
  saveProducts(filteredProducts);
};

// Get products with filtering and sorting
export const getFilteredProducts = (
  categoryFilter: string,
  subcategoryFilter: string,
  priceRange: { min: number; max: number },
  sortBy: string
): Product[] => {
  let products = loadProducts();

  // Apply category filter
  if (categoryFilter) {
    products = products.filter(p => p.category === categoryFilter);
    
    // Apply subcategory filter if a category is selected
    if (subcategoryFilter) {
      products = products.filter(p => p.subcategory === subcategoryFilter);
    }
  }

  // Apply price filter
  products = products.filter(
    p => p.price >= priceRange.min && p.price <= priceRange.max
  );

  // Apply sorting
  switch (sortBy) {
    case "price-asc":
      return products.sort((a, b) => a.price - b.price);
    case "price-desc":
      return products.sort((a, b) => b.price - a.price);
    case "date-asc":
      return products.sort((a, b) => 
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    case "date-desc":
    default:
      return products.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
  }
};
