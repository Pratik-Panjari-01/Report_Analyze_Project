import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import Analysis from "./pages/Analysis";
import History from "./pages/History";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export default function App() {
  if (!clientId) return <div className="setup-error">Set VITE_GOOGLE_CLIENT_ID in frontend/.env and restart the Vite server.</div>;
  return <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right"/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route element={<Layout/>}>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/upload" element={<UploadReport/>}/>
              <Route path="/analysis/:id" element={<Analysis/>}/>
              <Route path="/history" element={<History/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>;
}
