
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "@/utils/constants";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set admin authentication in localStorage
        localStorage.setItem("ovvo-admin-auth", "true");
        navigate("/admin/dashboard");
      } else {
        toast.error("Неверное имя пользователя или пароль");
      }
      setLoading(false);
    }, 800);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-brand" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Вход в панель администратора
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-brand hover:bg-brand-dark focus:outline-none transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Войти"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-brand hover:text-brand-dark">
              Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
