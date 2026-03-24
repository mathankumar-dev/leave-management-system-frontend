
import React from "react";
import { Toaster } from "sonner";
import AppRoutes from "@/app/AppRoutes.tsx";

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-900">
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </div>
  );
};

export default App;