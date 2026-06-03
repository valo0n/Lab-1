/* App.jsx — krejt route-t me 5 role te mbrojtura + code splitting (lazy loading) */
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

/* Faqet ngarkohen me React.lazy -> secila behet chunk i vecante.
   Browseri shkarkon vetem kodin e faqes qe vizitohet (code splitting). */
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const ProductDetail = lazy(() => import("./pages/shop/ProductDetail"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const Cart = lazy(() => import("./pages/cart/Cart"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const Wishlist = lazy(() => import("./pages/wishlist/Wishlist"));
const MyOrders = lazy(() => import("./pages/customer/MyOrders"));
const Profile = lazy(() => import("./pages/customer/Profile"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const ProductMedia = lazy(() => import("./pages/admin/ProductMedia"));
const ProductList = lazy(() => import("./pages/admin/ProductList"));
const ProductReviews = lazy(() => import("./pages/admin/ProductReviews"));
const Suppliers = lazy(() => import("./pages/admin/Suppliers"));
const Warranties = lazy(() => import("./pages/admin/Warranties"));
const ServiceRequests = lazy(() => import("./pages/admin/ServiceRequests"));

const TeknikDashboard = lazy(() => import("./pages/teknik/TeknikDashboard"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const ShitesDashboard = lazy(() => import("./pages/shites/ShitesDashboard"));

/* Shfaqet gjate shkarkimit te nje chunk */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted text-sm font-black">Duke ngarkuar...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
