import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ImageUploader from "@/components/ImageUploader";
import { CATEGORIES, generateId } from "@/utils/constants";
import { loadProducts, addProduct, updateProduct } from "@/utils/productStore";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  name: z.string().min(2, { message: "Название должно содержать не менее 2 символов" }),
  price: z.coerce.number().min(1, { message: "Цена должна быть больше 0" }),
  description: z.string().min(10, { message: "Описание должно содержать не менее 10 символов" }),
  category: z.string().min(1, { message: "Выберите категорию" }),
  subcategory: z.string().optional(),
  imageUrl: z.string().min(1, { message: "Добавьте изображение товара" }),
  adminLink: z.string().optional(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!id;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      subcategory: "",
      imageUrl: "",
      adminLink: "",
    },
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const products = await loadProducts();
          const product = products.find(p => p.id === id);
          
          if (product) {
            setCurrentProduct(product);
            form.reset({
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              subcategory: product.subcategory || "",
              imageUrl: product.imageUrl,
              adminLink: product.adminLink || "",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Ошибка",
              description: "Товар не найден"
            });
            navigate("/admin/dashboard");
          }
        } catch (error) {
          console.error("Error loading product:", error);
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: "Не удалось загрузить данные товара"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id, isEditMode, navigate, toast, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const productData: Product = {
        id: isEditMode ? id! : uuidv4(),
        name: values.name,
        price: values.price,
        description: values.description,
        category: values.category,
        subcategory: values.subcategory,
        imageUrl: values.imageUrl,
        dateAdded: isEditMode ? currentProduct!.dateAdded : new Date().toISOString(),
        adminLink: values.adminLink,
      };
      
      if (isEditMode) {
        await updateProduct(productData);
        toast({
          title: "Товар обновлен",
          description: "Изменения успешно сохранены"
        });
      } else {
        await addProduct(productData);
        toast({
          title: "Товар добавлен",
          description: "Новый товар успешно добавлен в каталог"
        });
      }
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить данные товара"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedCategory = form.watch("category");
  const selectedCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);
  
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Редактирование товара" : "Добавление товара"}
        </h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Изображение товара</FormLabel>
                    <FormControl>
                      <ImageUploader
                        onChange={field.onChange}
                        currentImage={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название товара</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название товара" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Цена (₸)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Введите цену" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedCategoryObj?.subcategories && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подкатегория</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Выберите подкатегорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCategoryObj.subcategories.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание товара</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите описание товара" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adminLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ссылка на товар (видна только администратору)</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите ссылку на товар (опционально)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => navigate("/admin/dashboard")}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : isEditMode ? "Сохранить изменения" : "Добавить товар"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
