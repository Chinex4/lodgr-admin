import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UserManagementPage from "./pages/dashboard/UserManagementPage";
import ContentModeration from "./pages/dashboard/ContentModeration";
import ContentCategoryManagement from "./pages/dashboard/ContentCategoryManagement";
import CommunicationNotificationPage from "./pages/dashboard/CommunicationNotificationPage";
import MonetizationPage from "./pages/dashboard/MonetizationPage";
import GeneralSettings from "./pages/dashboard/settings/General";
import SecurityAndAccess from "./pages/dashboard/settings/SecurityAndAccess";
import AuditLogs from "./pages/dashboard/settings/AuditLogs";
import { AuthProvider } from "./context/AuthContext";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="content-moderation" element={<ContentModeration />} />
            <Route
              path="content-category"
              element={<ContentCategoryManagement />}
            />
            <Route
              path="communication-notification"
              element={<CommunicationNotificationPage />}
            />
            <Route path="monetization" element={<MonetizationPage />} />
            <Route path="settings/general" element={<GeneralSettings />} />
            <Route
              path="settings/security-access"
              element={<SecurityAndAccess />}
            />
            <Route path="settings/audit-logs" element={<AuditLogs />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
