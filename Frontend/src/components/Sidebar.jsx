import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const baseLinks = [
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const roleLinks = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Stores', path: '/admin/stores' },
    ],
    STORE_OWNER: [
      { label: 'Dashboard', path: '/owner/dashboard' },
      { label: 'Ratings', path: '/owner/ratings' },
    ],
    USER: [
      { label: 'Stores', path: '/user/stores' },
    ],
  };

  const links = user ? roleLinks[user.role] : baseLinks;

  return (
    <aside className="w-full max-w-[220px] border-r border-slate-200 bg-white px-4 py-6 hidden md:block">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Menu</p>
      </div>
      <nav className="space-y-3">
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
