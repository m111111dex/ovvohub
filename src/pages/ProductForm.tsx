
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, formatPrice, generateId } from "@/utils/constants";
import { addProduct, loadProducts, updateProduct } from "@/utils/productStore";
import { Product } from "@/types";
import AdminLayout from "@/components/AdminLayout";
import AdminGuard from "@/components/AdminGuard";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
    subcategory: "",
    adminLink: "",
  });
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      const products = loadProducts();
      const existingProduct = products.find(p => p.id === id);
      
      if (existingProduct) {
        setProduct(existingProduct);
      } else {
        toast.error("Товар не найден");
        navigate("/admin/dashboard");
      }
    }
  }, [id, isEditMode, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      // Remove non-numeric characters and convert to number
      const numericValue = value.replace(/[^0-9]/g, "");
      setProduct(prev => ({ ...prev, [name]: numericValue ? parseInt(numericValue) : 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = (imageUrl: string) => {
    setProduct(prev => ({ ...prev, imageUrl }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = CATEGORIES.find(c => c.id === categoryId);
    
    setProduct(prev => ({
      ...prev,
      category: category ? category.name : "",
      subcategory: "", // Reset subcategory when category changes
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!product.name || !product.price || !product.imageUrl || !product.category) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      setLoading(false);
      return;
    }
    
    try {
      if (isEditMode && id) {
        updateProduct({
          ...product,
          id,
        } as Product);
        toast.success("Товар успешно обновлен");
      } else {
        const newProduct: Product = {
          ...product,
          id: generateId(),
          dateAdded: new Date().toISOString(),
        } as Product;
        
        addProduct(newProduct);
        toast.success("Товар успешно добавлен");
      }
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Произошла ошибка при сохранении товара");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectedCategory = CATEGORIES.find(c => c.name === product.category);
  
  return (
    <AdminGuard>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? "Редактирование товара" : "Добавление товара"}
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изображение товара*
                </label>
                <ImageUploader
                  onChange={handleImageChange}
                  currentImage={product.imageUrl}
                />
              </div>
              
              {/* Right column - Form fields */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название товара*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Цена (в тенге)*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">₸</span>
                  </div>
                  {product.price !== undefined && product.price > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selectedCategory?.id || ""}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Подкатегория
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={product.subcategory || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Выберите подкатегорию</option>
                      {selectedCategory.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="adminLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Ссылка на товар (видна только администратору)
                  </label>
                  <input
                    type="url"
                    id="adminLink"
                    name="adminLink"
                    value={product.adminLink || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/product"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : isEditMode ? (
                      "Сохранить изменения"
                    ) : (
                      "Добавить товар"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProductForm;
