// app/page.tsx
'use client';
import { useState, useTransition, useEffect } from 'react';
import StatusDropdown from "@/components/StatusDropdown";
import { createApplication } from "@/lib/action";
import { getApplications } from "@/lib/action"; // Import the fetcher

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [userJobs, setUserJobs] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Load real data from Supabase once logged in
  useEffect(() => {
    if (isLoggedIn) {
      startTransition(async () => {
        const data = await getApplications();
        setUserJobs(data);
      });
    }
  }, [isLoggedIn]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleCreateApplication = async (formData: FormData) => {
    startTransition(async () => {
      await createApplication(formData);
      // After creating, re-fetch the latest list from the DB
      const updatedData = await getApplications();
      setUserJobs(updatedData);
    });
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setPassword(''); // Reset fields for next login test loop
  };

  // --- VIEW 1: GATEWAY LOGIN SCREEN (MODERN & SLIMMED DOWN WIDTH) ---
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center p-4 animate-in fade-in duration-300">
        
        {/* The 400x556 Fixed Rectangular Box */}
        <div className="w-full max-w-100 bg-slate-800 rounded-2xl border border-slate-700/80 shadow-xl p-8 transform transition-all duration-300 animate-in fade-in zoom-in-95">
          
          {/* Header Typography */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-100">Recruiting CRM</h1>
            <p className="mt-1.5 text-xs text-slate-300 font-medium tracking-wide">
              {isSignUp ? 'Create a centralized tracking session' : 'Sign in to access your active loops'}
            </p>
          </div>

          {/* Form Matrix */}
          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shiva@example.com"
                className="w-full px-3 py-2.5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-700/40 text-slate-100 font-medium placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-700/40 text-slate-100 font-medium placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-bold text-sm rounded-xl transition-all shadow-md transform active:scale-[0.98] cursor-pointer"
            >
              {isSignUp ? 'Create Free Account' : 'Authenticate Session'}
            </button>
          </form>

          {/* Action Pivot */}
          <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-shadow-2xs! text-slate-100! hover:text-slate-300! transition-colors! cursor-pointer!"
            >
              {isSignUp ? <span className='text-shadow-2xs! text-slate-100!'>Already have an account? Sign In</span> : <span className='text-shadow-2xs! text-slate-100!'>Don't have an account? Sign Up</span>}
            </button>
          </div>

        </div>
      </main>
    );
  }

  // --- VIEW 2: LOGGED-IN CRM DASHBOARD (ISOLATED USER METRICS) ---
  return (
    <main className="min-h-screen bg-transparent text-slate-100 p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block with Integrated Logout Control */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white">Recruiting CRM Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Logged in securely as <span className="text-slate-400 font-semibold">{email.toLowerCase()}</span></p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 hover:border-slate-600 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Side Block */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 tracking-tight text-slate-100">Log New Application</h2>
            
            <form action={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Company Name *</label>
                <input name="companyName" type="text" required placeholder="e.g., Stripe, Google" className="w-full px-3 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-700/30 text-slate-100" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Role Title *</label>
                <input name="roleTitle" type="text" required placeholder="e.g., Software Engineer" className="w-full px-3 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-700/30 text-slate-100" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Salary Range</label>
                <input name="salaryRange" type="text" placeholder="e.g., $120k - $140k" className="w-full px-3 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-700/30 text-slate-100" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Current Pipeline Status</label>
                <select name="status" className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm cursor-pointer text-slate-100">
                  <option value="WISHLIST">Wishlist</option>
                  <option value="APPLIED">Applied</option>
                  <option value="OA_STAGE">OA Stage</option>
                  <option value="INTERVIEWING">Interviewing</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer">
                Add to Pipeline
              </button>
            </form>
          </div>

          {/* Jobs Listing Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-100 mb-2">Active Tracker Cards ({userJobs.length})</h2>
            <div className="space-y-3">
              {userJobs.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl text-center text-slate-400 text-sm">
                  No job applications added yet for this account. Use the form to submit your first card!
                </div>
              ) : (
                userJobs.map((app) => (
                  <div key={app.id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm flex items-center justify-between hover:border-slate-600 transition-all duration-150">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{app.companyName}</h3>
                      <p className="text-slate-300 text-sm font-medium">{app.roleTitle}</p>
                      {app.salaryRange && <span className="text-xs text-slate-400 mt-1 block font-medium">💰 {app.salaryRange}</span>}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <StatusDropdown id={app.id} currentStatus={app.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}