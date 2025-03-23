
import { Category } from "@/types";

export const ADMIN_USERNAME = "180618";
export const ADMIN_PASSWORD = "180618";

export const CATEGORIES: Category[] = [
  { id: "home", name: "Товары для дома" },
  { 
    id: "clothing", 
    name: "Одежда", 
    subcategories: ["Мужская", "Женская", "Детская"] 
  },
  { id: "computer", name: "Компьютерная периферия" },
  { 
    id: "underwear", 
    name: "Нижнее белье", 
    subcategories: ["Мужское", "Женское", "Детское"] 
  },
  { id: "tableware", name: "Посуда" },
  { id: "fishing", name: "Рыбалка" },
  { id: "electronics", name: "Электроника" },
  { id: "toys", name: "Игрушки" },
  { id: "furniture", name: "Мебель" },
  { id: "appliances", name: "Бытовая техника" },
  { id: "beauty", name: "Красота" },
  { id: "shoes", name: "Обувь" },
  { id: "stationery", name: "Канцтовары" },
  { id: "health", name: "Здоровье" },
];

export const STORAGE_KEY = "ovvo-catalog-products";

export const DEFAULT_FILTER_STATE = {
  category: "",
  subcategory: "",
  priceRange: { min: 0, max: 500000 },
  sortBy: "date-desc" as const
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ru-RU')} ₸`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
