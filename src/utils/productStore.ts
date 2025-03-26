
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Load products from Supabase
export const loadProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
    return [];
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.image_url,
    category: product.category_id,
    dateAdded: product.created_at,
    adminLink: product.product_link || undefined
  }));
};

// Save product to Supabase
export const addProduct = async (product: Product): Promise<void> => {
  const { error } = await supabase.from("products").insert({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    image_url: product.imageUrl,
    category_id: product.category,
    created_at: product.dateAdded,
    product_link: product.adminLink
  });

  if (error) {
    console.error("Error adding product:", error);
  }
};

// Update an existing product
export const updateProduct = async (product: Product): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .update({
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.imageUrl,
      category_id: product.category,
      product_link: product.adminLink
    })
    .eq("id", product.id);

  if (error) {
    console.error("Error updating product:", error);
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Error deleting product:", error);
  }
};

// Get products with filtering and sorting
export const getFilteredProducts = async (
  categoryFilter: string,
  subcategoryFilter: string,
  priceRange: { min: number; max: number },
  sortBy: string
): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select("*")
    .gte("price", priceRange.min)
    .lte("price", priceRange.max);

  // Apply category filter
  if (categoryFilter) {
    query = query.eq("category_id", categoryFilter);
  }

  // Apply sorting
  switch (sortBy) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "date-asc":
      query = query.order("created_at", { ascending: true });
      break;
    case "date-desc":
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.image_url,
    category: product.category_id,
    dateAdded: product.created_at,
    adminLink: product.product_link || undefined
  }));
};
