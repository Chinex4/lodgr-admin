import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import AppLayout from "./components/layouts/AppLayout";
import AdminForgotPasswordPage from "./pages/auth/AdminForgotPasswordPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AuditLogs from "./pages/admin/AuditLogs";
import Bookings from "./pages/admin/Bookings";
import ContactMessages from "./pages/admin/ContactMessages";
import Overview from "./pages/admin/Overview";
import Newsletter from "./pages/admin/Newsletter";
import PaymentMethods from "./pages/admin/PaymentMethods";
import Payouts from "./pages/admin/Payouts";
import Properties from "./pages/admin/Properties";
import PropertyDetail from "./pages/admin/PropertyDetail";
import PropertyEdit from "./pages/admin/PropertyEdit";
import Reviews from "./pages/admin/Reviews";
import Settings from "./pages/admin/Settings";
import Transactions from "./pages/admin/Transactions";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Withdrawals from "./pages/admin/Withdrawals";
import BookingDetail from "./pages/admin/BookingDetail";
import HomeSections from "./pages/admin/HomeSections";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UserDetail />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:propertyId" element={<PropertyDetail />} />
          <Route path="properties/:propertyId/edit" element={<PropertyEdit />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:bookingId" element={<BookingDetail />} />
          <Route path="home-sections" element={<HomeSections />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
