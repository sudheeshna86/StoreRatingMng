import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 className="text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The route you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Back to home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
