
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Страница не найдена</p>
        <a href="/" className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark">
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
