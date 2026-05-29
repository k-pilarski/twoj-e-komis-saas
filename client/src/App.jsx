import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Importujemy Strażnika

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Przekierowanie głównego adresu na logowanie */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Trasy publiczne (niechronione) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Trasy prywatne (chronione przez naszego Strażnika) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}