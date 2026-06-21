import { Link } from 'react-router-dom';

const features = [
  'Users can sign up and submit ratings',
  'Admins manage users and stores',
  'Store owners view ratings for their store',
  'Role-based dashboards with clean controls',
];

const roles = [
  { title: 'Admin', description: 'Manage users, stores, and platform stats' },
  { title: 'Store Owner', description: 'See ratings for your assigned store' },
  { title: 'User', description: 'Browse stores and submit ratings' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="text-center mb-14">
        <p className="text-indigo-500 font-semibold uppercase tracking-[0.3em] mb-4">Store Rating System</p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Rate stores with confidence</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">A role-based rating platform for admins, store owners, and customers. Manage stores, submit ratings, and review performance in one clean dashboard.</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 transition">Login</Link>
          <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-white border border-slate-300 px-8 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition">Register</Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 mb-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Core features</h2>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Who can use it?</h2>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-xl font-semibold">{role.title}</p>
                <p className="text-slate-600 mt-1">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-8 text-center text-slate-500 text-sm">
        Built with React, Tailwind CSS, and a Node.js backend. Simple, responsive and internship-ready.
      </footer>
    </div>
  </div>
);

export default LandingPage;
