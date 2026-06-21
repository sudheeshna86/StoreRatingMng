import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <span className="text-lg font-semibold text-slate-900">StoreRating</span>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-slate-700 font-medium">{user.name}</span>}
        {user && (
          <button
            type="button"
            onClick={() => navigate('/change-password')}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            Change Password
          </button>
        )}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
