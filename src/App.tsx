// src/App.tsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-900">
      {/* We no longer pass props here; AppRoutes will use the Context Hook instead */}
      <AppRoutes />
    </div>
  );
};

export default App;