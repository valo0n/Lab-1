/* App.jsx — krejt route-t e Paradox Tech */
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Landing & Public pages */
import LandingPage from "./pages/landing/LandingPage";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/shop/ProductDetail";

/* Auth */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Customer pages */
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";

/* Admin */
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

/* Protect admin routes */
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ═══════ PUBLIC PAGES ═══════ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* ═══════ AUTH ═══════ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ═══════ CUSTOMER PAGES ═══════ */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />

        {/* ═══════ ADMIN PAGES (Protected) ═══════ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
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

          {/* Products */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/media" element={<ProductMedia />} />
          <Route path="products/reviews" element={<ProductReviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
