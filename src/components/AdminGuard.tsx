
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("ovvo-admin-auth");
    
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default AdminGuard;
