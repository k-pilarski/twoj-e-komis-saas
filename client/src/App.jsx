import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} /> 
          
          <Route path="builder" element={<div className="text-2xl font-bold">Kreator Strony - Wkrótce</div>} />
          <Route path="inventory" element={<div className="text-2xl font-bold">Inwentarz - Wkrótce</div>} />
          <Route path="documents" element={<div className="text-2xl font-bold">Generator Dokumentów - Wkrótce</div>} />
          <Route path="settings" element={<div className="text-2xl font-bold">Ustawienia - Wkrótce</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}