import { useEffect, useState } from 'react';
import { getUsers, getUserDetails, createUser } from '../api/adminApi';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const query = { page, limit: 10, name: search, role };
    const response = await getUsers(query);
    setUsers(response.data);
    setPagination(response.pagination);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [page, role]);

  const openUserDetails = async (userId) => {
    setDetailsLoading(true);
    setDetailsModalOpen(true);

    try {
      const response = await getUserDetails(userId);
      setSelectedUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load user details.');
      setSelectedUser(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await createUser(form);
      setModalOpen(false);
      setForm({ name: '', email: '', address: '', password: '', role: 'USER' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
          <p className="text-slate-500">Manage application users and roles.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Add User
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.address}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <button
                      type="button"
                      onClick={() => openUserDetails(user.id)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                    >
                      View profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />

      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">User profile</h3>
              <button type="button" onClick={() => setDetailsModalOpen(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            {detailsLoading ? (
              <div className="text-slate-600">Loading profile...</div>
            ) : selectedUser ? (
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Name</p>
                  <p className="text-lg font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Address</p>
                  <p>{selectedUser.address}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Role</p>
                  <p>{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Store rating</p>
                  <p>{selectedUser.store_rating === null ? 'N/A' : selectedUser.store_rating}</p>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Unable to load user profile.</div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Add new user</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none">
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-slate-300 px-5 py-3 hover:bg-slate-100 transition">Cancel</button>
                <button type="submit" className="rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
