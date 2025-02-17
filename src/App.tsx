import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import QualityControlList from './pages/QualityControlList';
import QualityControlForm from './pages/QualityControlForm';
import Management from './pages/Management';

function App() {
  const { session } = useAuth();

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<QualityControlList />} />
            <Route path="/quality-control/new" element={<QualityControlForm />} />
            <Route path="/quality-control/:id" element={<QualityControlForm />} />
            <Route path="/management" element={<Management />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;