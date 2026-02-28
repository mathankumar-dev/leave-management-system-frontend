
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-900">
      <Toaster position="top-right" richColors closeButton />

      <AppRoutes />
    </div>
  );
};

export default App;