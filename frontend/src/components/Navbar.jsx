import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FullLogo } from './Logo';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-8 py-4">
        <FullLogo iconClassName="w-10 h-10" />
        
        <div className="flex items-center space-x-6">

          
          <div className="flex items-center space-x-2 text-gray-600">
            <User size={18} />
            <span className="font-medium">{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
