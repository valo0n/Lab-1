/* App.jsx — krejt route-t me 5 role te mbrojtura */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/shop/ProductDetail";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import OrderManagement from "./pages/admin/OrderManagement";
import Customers from "./pages/admin/Customers";
import Categories from "./pages/admin/Categories";
import Transaction from "./pages/admin/Transaction";
import AddProduct from "./pages/admin/AddProduct";
import ProductMedia from "./pages/admin/ProductMedia";
import ProductList from "./pages/admin/ProductList";
import ProductReviews from "./pages/admin/ProductReviews";
import Suppliers from "./pages/admin/Suppliers";
import Warranties from "./pages/admin/Warranties";
import ServiceRequests from "./pages/admin/ServiceRequests";

import TeknikDashboard from "./pages/teknik/TeknikDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ShitesDashboard from "./pages/shites/ShitesDashboard";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />

        {/* ADMIN - vetem Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transaction />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="warranties" element={<Warranties />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/media" element={<ProductMedia />} />
          <Route path="products/reviews" element={<ProductReviews />} />
        </Route>

        {/* TEKNIK - vetem Teknik */}
        <Route
          path="/teknik"
          element={
            <ProtectedRoute requiredRole="Teknik">
              <TeknikDashboard />
            </ProtectedRoute>
          }
        />

        {/* MANAGER - vetem Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="Manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* SHITES - vetem Shites */}
        <Route
          path="/shites"
          element={
            <ProtectedRoute requiredRole="Shites">
              <ShitesDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
