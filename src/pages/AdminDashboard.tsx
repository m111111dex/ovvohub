
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { loadProducts, deleteProduct } from "@/utils/productStore";
import { formatPrice } from "@/utils/constants";
import AdminLayout from "@/components/AdminLayout";
import AdminGuard from "@/components/AdminGuard";
import { ArrowUpDown, Edit, ExternalLink, Trash } from "lucide-react";
import { toast } from "sonner";

type SortField = "name" | "price" | "category" | "dateAdded";
type SortDirection = "asc" | "desc";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<SortField>("dateAdded");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const storedProducts = loadProducts();
    sortProducts(storedProducts, sortField, sortDirection);
  }, [sortField, sortDirection]);
  
  const sortProducts = (
    productsToSort: Product[],
    field: SortField,
    direction: SortDirection
  ) => {
    const sorted = [...productsToSort].sort((a, b) => {
      if (field === "price") {
        return direction === "asc" ? a.price - b.price : b.price - a.price;
      } else if (field === "dateAdded") {
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (field === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (field === "category") {
        const catA = `${a.category}${a.subcategory || ""}`;
        const catB = `${b.category}${b.subcategory || ""}`;
        return direction === "asc"
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }
      return 0;
    });
    
    setProducts(sorted);
  };
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success("Товар успешно удален");
    }
  };
  
  const filteredProducts = products.filter(product => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(search))
    );
  });
  
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    
    return sortDirection === "asc" ? (
      <ArrowUpDown className="h-4 w-4 transform rotate-180" />
    ) : (
      <ArrowUpDown className="h-4 w-4" />
    );
  };
  
  return (
    <AdminGuard>
      <AdminLayout>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Список товаров</h1>
          <Link
            to="/admin/add-product"
            className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors inline-flex items-center justify-center sm:w-auto w-full"
          >
            Добавить товар
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Фото
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Название</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Цена</span>
                        {getSortIcon("price")}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Категория</span>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("dateAdded")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Дата добавления</span>
                        {getSortIcon("dateAdded")}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/F0F0F0/CCCCCC?text=OVVO';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-brand font-semibold">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                        {product.subcategory && (
                          <div className="text-xs text-gray-500">{product.subcategory}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.dateAdded).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {product.adminLink && (
                            <a
                              href={product.adminLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-brand"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                          <Link
                            to={`/admin/edit-product/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? "Товары не найдены" : "Нет товаров в каталоге"}
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
