<<<<<<< HEAD
import Dashboard from "./components/Dashboard";
import "./components/dashboard.css";

function App() {
  return <Dashboard/>
}

export default App
=======
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
>>>>>>> ef840b7b368a91125478269a5a0dd298eab966cc
