
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  onChange: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUploader = ({ onChange, currentImage }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Пожалуйста, загрузите изображение");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange("");
  };
  
  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
    if (showLinkInput) {
      setImageLink("");
    }
  };
  
  const handleLinkSubmit = () => {
    if (!imageLink.trim()) return;
    
    setImagePreview(imageLink);
    onChange(imageLink);
    setShowLinkInput(false);
    setImageLink("");
  };
  
  return (
    <div>
      {!imagePreview ? (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-brand bg-brand/5" : "border-gray-300",
            "relative"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Перетащите изображение сюда или
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP до 5MB
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors text-sm"
              >
                Выбрать файл
              </button>
              <button
                type="button"
                onClick={toggleLinkInput}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                По ссылке
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imagePreview}
            alt="Предпросмотр"
            className="w-full aspect-square object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
      
      {showLinkInput && !imagePreview && (
        <div className="mt-3 flex space-x-2">
          <input
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="Вставьте URL изображения"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleLinkSubmit}
            className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors"
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
