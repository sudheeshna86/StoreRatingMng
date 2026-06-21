import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/adminApi';
import Loader from '../components/Loader';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const response = await getDashboard();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="text-slate-600">Overview of platform metrics and quick actions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition">
            Manage users
          </Link>
          <Link to="/admin/stores" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            Manage stores
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total users</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalUsers}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total stores</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalStores}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total ratings</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalRatings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
