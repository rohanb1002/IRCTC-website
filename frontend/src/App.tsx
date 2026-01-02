import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import BookingsHistory from "./pages/BookingsHistory";
import Profile from "./pages/Profile";
import ManageTrains from "./pages/admin/ManageTrains";
import AddTrain from "./pages/admin/AddTrain";
import ManageRoutes from "./pages/admin/ManageRoutes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/bookings" element={<BookingsHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/trains" element={<ManageTrains />} />
            <Route path="/admin/trains/add" element={<AddTrain />} />
            <Route path="/admin/routes" element={<ManageRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
