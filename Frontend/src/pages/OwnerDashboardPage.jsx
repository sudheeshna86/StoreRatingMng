import { useEffect, useState } from 'react';
import { getDashboard } from '../api/ownerApi';
import Loader from '../components/Loader';

const OwnerDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load owner dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Owner dashboard</h1>
        <p className="text-slate-600">Review your assigned store performance and recent ratings.</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Store name</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{dashboard?.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Average rating</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{dashboard?.average_rating ?? '-'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total ratings</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{dashboard?.total_ratings ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardPage;
