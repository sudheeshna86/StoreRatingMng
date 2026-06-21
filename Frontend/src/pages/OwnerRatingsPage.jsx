import { useEffect, useState } from 'react';
import { getRatings } from '../api/ownerApi';
import Loader from '../components/Loader';

const OwnerRatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRatings = async () => {
      setLoading(true);
      try {
        const response = await getRatings();
        setRatings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load store ratings.');
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Ratings</h1>
        <p className="text-slate-600">Recent customer ratings for your store.</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {ratings.map((rating) => (
                <tr key={`${rating.id}-${rating.created_at}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{rating.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{rating.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{rating.rating}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{new Date(rating.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerRatingsPage;
