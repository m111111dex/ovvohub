
import { Product } from "@/types";
import { formatPrice } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = product.imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [product.imageUrl]);

  return (
    <div 
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 card-hover animate-fade-in",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Изображение недоступно</span>
          </div>
        )}
        
        {!imageError && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              "object-cover w-full h-full transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
        
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-brand font-semibold whitespace-nowrap">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-500 truncate ml-2 text-right">
              {product.subcategory 
                ? `${product.category} / ${product.subcategory}`
                : product.category}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none cursor-pointer" 
             onClick={() => setShowDescription(!showDescription)}>
            {showDescription 
              ? product.description 
              : product.description.length > 100 
                ? `${product.description.substring(0, 100)}...` 
                : product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
