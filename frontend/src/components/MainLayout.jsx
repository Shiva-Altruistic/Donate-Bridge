import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-[#f9fafb] font-sans overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 flex flex-col bg-[#f9fafb]">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2026 DonateBridge. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
