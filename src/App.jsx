import { useState } from "react";
import { AppProvider } from "./contexts/AppContext";
import { Layout } from "./components";
import { Dashboard, Schedule, Teachers, Management, Settings } from "./pages";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onPageChange={setCurrentPage} />;
      case "schedule":
        return <Schedule />;
      case "teachers":
        return <Teachers />;
      case "management":
        return <Management />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;
