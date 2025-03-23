
import { ReactNode, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Boxes, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Список товаров",
      icon: <Boxes className="h-5 w-5" />,
    },
    {
      path: "/admin/add-product",
      label: "Добавить товар",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ];
  
  const handleLogout = () => {
    localStorage.removeItem("ovvo-admin-auth");
    navigate("/admin");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-black/50" onClick={toggleSidebar}></div>
        <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg">
          <div className="p-4 flex justify-between items-center border-b">
            <span className="font-semibold text-lg">OVVO Admin</span>
            <button onClick={toggleSidebar} className="p-1">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md",
                      location.pathname === item.path
                        ? "bg-brand text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-brand w-full px-3 py-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-sm border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <span className="font-semibold text-lg">OVVO Admin</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-brand text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-700 hover:text-brand w-full px-3 py-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <header className="bg-white shadow-sm h-16 flex items-center z-10 sticky top-0">
          <div className="px-4 flex items-center justify-between w-full">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-600"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-brand"
                target="_blank"
                rel="noreferrer"
              >
                Перейти на сайт
              </a>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
