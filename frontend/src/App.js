import { BrowserRouter, Routes, Route } from "react-router-dom";

import HotelLanding from "./pages/HotelLanding"; // Reusing file, internal rename
import HotelListing from "./pages/HotelListing";
import HotelDetail from "./pages/HotelDetail";
import BookingPage from "./pages/BookingPage";
import BookingStatus from "./pages/BookingStatus";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HotelDashboard from "./pages/HotelDashboard";
import Leads from "./pages/Leads";
import Bookings from "./pages/Bookings";
import Products from "./pages/Products";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Pipeline from "./pages/Pipeline";
import Trekkers from "./pages/Trekkers";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import Safety from "./pages/Safety";
import Journal from "./pages/Journal";

import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Adventure Routes */}
        <Route path="/" element={<HotelLanding />} />
        <Route path="/treks" element={<HotelListing />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-status/:ref" element={<BookingStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/journal" element={<Journal />} />

        {/* Protected CRM Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/hotel-dashboard" element={
          <ProtectedRoute>
            <Layout><HotelDashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute>
            <Layout><Leads /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/trekkers" element={
          <ProtectedRoute>
            <Layout><Trekkers /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <Layout><Products /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute>
            <Layout><Bookings /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/quotations" element={
          <ProtectedRoute>
            <Layout><Quotations /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/invoices" element={
          <ProtectedRoute>
            <Layout><Invoices /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/revenue" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/pipeline" element={
          <ProtectedRoute>
            <Layout><Pipeline /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout><Tasks /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <Layout><Users /></Layout>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;