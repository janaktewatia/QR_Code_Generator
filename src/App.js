// src/App.jsx
import React, { useState } from "react";
import Sidebar from "./components/common/Sidebar";
import { QRProvider } from "./context/QRContext";
import { HistoryProvider } from "./context/HistoryContext";
import QRGeneratorPage from "./pages/QRGeneratorPage";
import ImportQRPage from "./pages/ImportQRPage";
import ToastNotification from "./components/common/ToastNotification";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";

function App() {
  const [activePage, setActivePage] = useState("generate");

  const renderContent = () => {
    if (activePage === "import") {
      return <ImportQRPage />;
    }

    return <QRGeneratorPage />;
  };

  return (
    <QRProvider>
      <HistoryProvider>
        <div className="app-shell">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />

          <main className="main-content">{renderContent()}</main>

          <ToastNotification />
        </div>
      </HistoryProvider>
    </QRProvider>
  );
}

export default App;
