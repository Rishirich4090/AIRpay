import "./global.css";

// Filter out React's defaultProps warnings from third-party libraries like Recharts
// Only in development mode to avoid affecting production console
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' &&
        (message.includes('Support for defaultProps will be removed') ||
         message.includes('defaultProps will be removed from function components'))) {
      return; // Suppress these specific warnings in development
    }
    originalWarn.apply(console, args);
  };
}

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealTimeDataProvider } from "@/contexts/RealTimeDataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import React, { Suspense } from "react";
const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Profile = React.lazy(() => import("./pages/Profile"));
const MerchantManagement = React.lazy(() => import("./pages/MerchantManagement"));
const BankList = React.lazy(() => import("./pages/BankList"));
const WalletList = React.lazy(() => import("./pages/WalletList"));
const UpdatePGLimitPolicy = React.lazy(() => import("./pages/UpdatePGLimitPolicy"));
const TransactionUpdate = React.lazy(() => import("./pages/TransactionUpdate"));
const PGManagement = React.lazy(() => import("./pages/PGManagement"));
const TransactionReport = React.lazy(() => import("./pages/TransactionReport"));
const DownloadReport = React.lazy(() => import("./pages/DownloadReport"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Placeholder = React.lazy(() => import("./pages/Placeholder"));

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RealTimeDataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/merchant-management" element={
                  <ProtectedRoute>
                    <MerchantManagement />
                  </ProtectedRoute>
                } />
                <Route path="/bank-list" element={
                  <ProtectedRoute>
                    <BankList />
                  </ProtectedRoute>
                } />
                <Route path="/wallet-list" element={
                  <ProtectedRoute>
                    <WalletList />
                  </ProtectedRoute>
                } />
                <Route path="/update-pg-limit-policy" element={
                  <ProtectedRoute>
                    <UpdatePGLimitPolicy />
                  </ProtectedRoute>
                } />
                <Route path="/transaction-update" element={
                  <ProtectedRoute>
                    <TransactionUpdate />
                  </ProtectedRoute>
                } />
                <Route path="/pg-management" element={
                  <ProtectedRoute>
                    <PGManagement />
                  </ProtectedRoute>
                } />
                <Route path="/transaction-report" element={
                  <ProtectedRoute>
                    <TransactionReport />
                  </ProtectedRoute>
                } />
                <Route path="/download-report" element={
                  <ProtectedRoute>
                    <DownloadReport />
                  </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </RealTimeDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
