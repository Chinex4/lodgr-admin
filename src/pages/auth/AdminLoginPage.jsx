// src/pages/auth/AdminLoginPage.jsx
import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@zagasm.com");
  const [password, setPassword] = useState("Admin123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({ email, password });

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Unable to login.");
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid gap-6 lg:gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Left panel */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-[#3b82f6] to-[#0f172a] p-px shadow-[0_24px_70px_rgba(15,23,42,0.9)]">
          <div className="h-full w-full rounded-3xl bg-[#050816] px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">
            {/* Brand header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-violet-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-200/80">
                    Zagasm Admin
                  </p>
                  <p className="text-sm text-violet-100/90">
                    Trust &amp; Safety Control Room
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-white/5 px-3 py-1.5 border border-white/10 text-[11px] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Sandbox Environment
              </div>
            </div>

            {/* Stats / timeline */}
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs text-slate-300/70 mb-2">
                  Live moderation snapshot
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-300/80">
                      Active Reports
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">238</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      -12% vs last hour
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/3 border border-white/10 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-300/80">
                      Policy Violations
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">42</p>
                    <p className="mt-1 text-[11px] text-amber-300">
                      +5 pending review
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/3 border border-white/10 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-300/80">
                      System Health
                    </p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      99.9%
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      All services stable
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini sparkline placeholder */}
              <div className="rounded-3xl bg-linear-to-tr from-white/5 via-white/0 to-white/10 border border-white/10 px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300/80">
                    Login activity
                  </p>
                  <p className="mt-1 text-sm text-slate-100">
                    Last admin login • 3 min ago
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300/90">
                    All logins are tracked in the audit log.
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <div className="relative h-16 w-24">
                    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-violet-500/40 to-sky-400/40 blur-xl" />
                    <div className="relative h-full w-full rounded-[18px] border border-white/15 bg-slate-900/60 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-violet-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="mt-8 text-[11px] text-slate-400/80">
              Logged actions are visible to other super-admins in real time.
            </div>
          </div>
        </div>

        {/* Right panel – login form */}
        <div className="bg-white/95 text-slate-900 rounded-3xl shadow-[0_22px_60px_rgba(15,23,42,0.65)] border border-white/70 flex flex-col justify-center px-5 sm:px-8 py-6 sm:py-10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
              Admin Access
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Sign in to Zagasm Console
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Use your admin credentials. All sessions are monitored and logged.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Mail className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  placeholder="admin@zagasm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-700">Password</label>
                <span className="text-slate-400">
                  (dummy: <span className="font-mono">Admin123!</span>)
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Lock className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember + info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary/50"
                  defaultChecked
                />
                Remember this device
              </label>
              <span className="text-primary cursor-default">
                Forgot password?
              </span>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-linear-to-r from-primary to-primarySecond text-white text-sm font-semibold py-2.5 shadow-[0_14px_30px_rgba(143,7,231,0.35)] hover:brightness-[1.03] disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? "Signing you in…" : "Enter Admin Console"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-slate-400">
            By signing in you acknowledge that all actions are recorded in the
            audit log for security and compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
