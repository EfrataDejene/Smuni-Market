import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import SellerLogin from './pages/auth/SellerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import DeliveryLogin from './pages/auth/DeliveryLogin';

// Customer pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import ChapaPayment from './pages/customer/ChapaPayment';
import OrderSuccess from './pages/customer/OrderSuccess';
import CustomerAccount from './pages/customer/CustomerAccount';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Delivery pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Customer Routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* ── Auth Routes ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/delivery/login" element={<DeliveryLogin />} />

          {/* ── Protected Customer Routes ── */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/chapa-payment/:orderId" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <ChapaPayment />
            </ProtectedRoute>
          } />
          <Route path="/order-success/:orderId" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerAccount />
            </ProtectedRoute>
          } />

          {/* ── Protected Seller Routes ── */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />

          {/* ── Protected Admin Routes ── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Catch all admin sub-routes and redirect */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

          {/* ── Protected Delivery Routes ── */}
          <Route path="/delivery/dashboard" element={
            <ProtectedRoute allowedRoles={['Delivery']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } />

          {/* ── Catch-all: 404 ── */}
          <Route path="*" element={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center px-4">
              <div className="space-y-4">
                <h1 className="text-6xl font-black text-gray-200">404</h1>
                <p className="font-bold text-gray-800">Page Not Found</p>
                <p className="text-xs text-gray-400">The page you are looking for does not exist.</p>
                <a href="/" className="inline-block bg-[#0066D6] hover:bg-[#0052B4] text-white font-bold text-xs px-6 py-2.5 rounded-lg transition">
                  Back to SMUNI-Market
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
