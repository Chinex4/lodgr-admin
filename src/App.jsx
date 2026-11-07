import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import AppLayout from "./components/layouts/AppLayout";
import AdminForgotPasswordPage from "./pages/auth/AdminForgotPasswordPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AuditLogs from "./pages/admin/AuditLogs";
import Backups from "./pages/admin/Backups";
import Bookings from "./pages/admin/Bookings";
import ContactMessages from "./pages/admin/ContactMessages";
import Disputes from "./pages/admin/Disputes";
import Overview from "./pages/admin/Overview";
import Newsletter from "./pages/admin/Newsletter";
import PaymentMethods from "./pages/admin/PaymentMethods";
import PaymentReconciliations from "./pages/admin/PaymentReconciliations";
import Payouts from "./pages/admin/Payouts";
import Properties from "./pages/admin/Properties";
import PropertyDetail from "./pages/admin/PropertyDetail";
import PropertyEdit from "./pages/admin/PropertyEdit";
import Reviews from "./pages/admin/Reviews";
import RiskFlags from "./pages/admin/RiskFlags";
import Settings from "./pages/admin/Settings";
import Transactions from "./pages/admin/Transactions";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Withdrawals from "./pages/admin/Withdrawals";
import BookingDetail from "./pages/admin/BookingDetail";
import HomeSections from "./pages/admin/HomeSections";
import HostVerifications from "./pages/admin/HostVerifications";

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
          <Route path="risk-flags" element={<RiskFlags />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="host-verifications" element={<HostVerifications />} />
          <Route path="home-sections" element={<HomeSections />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="payment-reconciliations" element={<PaymentReconciliations />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="backups" element={<Backups />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
