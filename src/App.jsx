import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layouts/AppLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import UserManagementPage from './pages/dashboard/UserManagementPage'
import ContentModeration from './pages/dashboard/ContentModeration'
import ContentCategoryManagement from './pages/dashboard/ContentCategoryManagement'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="content-moderation" element={<ContentModeration />} />
          <Route path="content-category" element={<ContentCategoryManagement />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
