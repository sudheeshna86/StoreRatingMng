import { useEffect, useState } from 'react';
import { getStores, createStore, getStoreOwnersWithoutStore, getStoreDetails } from '../api/adminApi';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [eligibleOwners, setEligibleOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await getStores({ page, limit: 10 });
      setStores(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
    loadEligibleOwners();
  }, [page]);

  const loadEligibleOwners = async () => {
    setOwnersLoading(true);
    try {
      const response = await getStoreOwnersWithoutStore();
      setEligibleOwners(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load owner list.');
    } finally {
      setOwnersLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.address || !form.ownerId) {
      setError('All fields are required.');
      return;
    }

    try {
      await createStore(form);
      setModalOpen(false);
      setForm({ name: '', email: '', address: '', ownerId: '' });
      loadStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create store.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Stores</h1>
          <p className="text-slate-600">Create and review the store inventory managed by owners.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          Add store
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{store.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{store.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{store.address}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{store.owner_name || store.owner_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <button
                        type="button"
                        onClick={async () => {
                          setDetailsLoading(true);
                          setDetailsModalOpen(true);
                          try {
                            const res = await getStoreDetails(store.id);
                            setSelectedStore(res.data);
                          } catch (err) {
                            setSelectedStore(null);
                          } finally {
                            setDetailsLoading(false);
                          }
                        }}
                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                      >
                        View details
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Create a new store</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Store name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Store email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Store owner</label>
                <select
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select store owner</option>
                  {eligibleOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                {ownersLoading && <p className="text-sm text-slate-500 mt-2">Loading available owners...</p>}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-slate-300 px-5 py-3 hover:bg-slate-100 transition">Cancel</button>
                <button type="submit" className="rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition">Create store</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Store details</h3>
              <button type="button" onClick={() => setDetailsModalOpen(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            {detailsLoading ? (
              <div className="text-slate-600">Loading...</div>
            ) : selectedStore ? (
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Name</p>
                  <p className="text-lg font-semibold">{selectedStore.name}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Owner</p>
                  <p>{selectedStore.owner_name}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Address</p>
                  <p>{selectedStore.address}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Rating</p>
                  <p>{selectedStore.rating}</p>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Unable to load store details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoresPage;
