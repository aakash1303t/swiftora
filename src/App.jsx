import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import CurrentInventoryPage from "./pages/CurrentInventoryPage";
import MySupermarkets from "./pages/MySupermarkets";
import Orders from "./pages/Orders";
import SupplierProfilePage from "./pages/SupplierProfilePage";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupermarketDashboard from "./pages/SupermarketDashboard";
import BarcodeScanner from "./pages/BarcodeScanner";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/supermarket-dashboard" element={<SupermarketDashboard />} />
      <Route path="/my-supermarkets" element={<MySupermarkets />} />
      <Route path="/inventory" element={<CurrentInventoryPage />} />
      <Route path="/barcode-scanner" element={<BarcodeScanner />} />
      <Route path="/my-orders" element={<Orders />} />
      <Route path="/supplier-profile" element={<SupplierProfilePage />} />
    </Routes>
  );
}

export default App;
