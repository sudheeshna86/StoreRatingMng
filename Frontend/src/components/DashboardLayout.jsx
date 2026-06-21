import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl gap-6 px-4 py-6 xl:px-8">
      <Sidebar />
      <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
