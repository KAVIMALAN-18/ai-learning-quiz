import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ProductionBanner from "./components/ProductionBanner";
import OfflineStatus from "./components/OfflineStatus";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ProductionBanner />
        <AppRoutes />
        <OfflineStatus />
      </div>
    </BrowserRouter>
  );
}

export default App;
