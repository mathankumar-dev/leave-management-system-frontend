// src/App.tsx
import React, { useState } from "react";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <div className="antialiased text-slate-900">
      
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        userRole={userRole} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </div>
  );
};

export default App;