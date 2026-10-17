// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Inventory from './pages/Inventory';
import VehicleForm from './pages/VehicleForm';
import Builder from './pages/Builder';
import Storefront from './pages/Storefront';
import Documents from './pages/Documents';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Publiczna wizytówka komisu */}
        <Route path="/komis/:slug" element={<Storefront />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} /> 
          <Route path="builder" element={<Builder />} />
          
          <Route path="inventory" element={<Inventory />} /> 
          <Route path="inventory/new" element={<VehicleForm />} />
          <Route path="inventory/:id/edit" element={<VehicleForm />} />

          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<div className="text-2xl font-bold">Ustawienia - Wkrótce</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}