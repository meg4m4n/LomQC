import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-800">
              QC Manager
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ClipboardList size={20} />
                <span>Controle de Qualidade</span>
              </Link>
              <Link
                to="/management"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/management'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                <span>Gestão</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;