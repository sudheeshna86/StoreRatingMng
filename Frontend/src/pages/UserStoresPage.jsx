import { useEffect, useState } from 'react';
import { getStores, submitRating, updateRating } from '../api/storeApi';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const UserStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [savingStoreId, setSavingStoreId] = useState(null);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState('');

  const loadStores = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getStores({ page, limit: 10 });
      setStores(response.data);
      setPagination(response.pagination);
      setRatings(
        response.data.reduce((acc, store) => {
          acc[store.id] = store.user_rating ?? '';
          return acc;
        }, {})
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [page]);

  const handleRatingChange = (storeId, value) => {
    setRatings((current) => ({
      ...current,
      [storeId]: value,
    }));
  };

  const handleSaveRating = async (store) => {
    setSavingStoreId(store.id);
    setError('');

    try {
      const ratingValue = Number(ratings[store.id]);
      if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
        throw new Error('Enter a rating between 1 and 5.');
      }

      if (store.user_rating) {
        await updateRating(store.id, { rating: ratingValue });
      } else {
        await submitRating(store.id, { rating: ratingValue });
      }

      await loadStores();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to save rating.');
    } finally {
      setSavingStoreId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Stores</h1>
        <p className="text-slate-600">Browse stores and submit ratings for your favorites.</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <p className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Overall Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Your Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">{store.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{store.address}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{store.overall_rating}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        value={ratings[store.id] ?? ''}
                        onChange={(e) => handleRatingChange(store.id, e.target.value)}
                        className="w-20 rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <button
                        type="button"
                        onClick={() => handleSaveRating(store)}
                        disabled={savingStoreId === store.id}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {store.user_rating ? 'Update' : 'Submit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default UserStoresPage;
