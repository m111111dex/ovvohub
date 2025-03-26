
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/constants";
import { deleteProduct, loadProducts } from "@/utils/productStore";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Edit, Plus, Trash } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const loadedProducts = await loadProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки товаров",
        description: "Не удалось загрузить список товаров"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (sortColumn === "price") {
      return (a.price - b.price) * modifier;
    } else if (sortColumn === "date") {
      return (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()) * modifier;
    } else if (sortColumn === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }
    return 0;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        await deleteProduct(id);
        toast({
          title: "Товар удален",
          description: "Товар был успешно удален из каталога"
        });
        fetchProducts(); // Refresh products list
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          variant: "destructive",
          title: "Ошибка удаления",
          description: "Не удалось удалить товар"
        });
      }
    }
  };

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <TableHead className="cursor-pointer" onClick={() => handleSort(column)}>
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown 
          className={`h-4 w-4 ${sortColumn === column ? "text-brand" : "text-gray-400"}`} 
        />
      </div>
    </TableHead>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link to="/admin/add-product">
          <Button className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" /> Добавить товар
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-full h-12 bg-gray-100 rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Фото</TableHead>
                <SortableHeader column="name" label="Название" />
                <SortableHeader column="price" label="Цена" />
                <TableHead>Категория</TableHead>
                <SortableHeader column="date" label="Дата" />
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=Нет+фото";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {new Date(product.dateAdded).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/edit-product/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Нет добавленных товаров
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
