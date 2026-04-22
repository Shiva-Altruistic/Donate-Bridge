import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, ListOrdered, Building2, Users, HeartHandshake } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      name: 'Make a Donation', 
      path: '/donate', 
      icon: <HeartHandshake size={20} />
    },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Donations', path: '/admin/donations', icon: <ListOrdered size={20} /> },
    { name: 'NGO Management', path: '/admin/ngos', icon: <Building2 size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex flex-col pt-4">
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-[#2563eb]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
