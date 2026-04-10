'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Set cookie then verify by hitting a protected endpoint
    document.cookie = `rm_auth=${password}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

    const check = await fetch('/api/v1/health');
    if (check.ok) {
      router.push('/');
    } else {
      setError('Wrong password');
      document.cookie = 'rm_auth=; path=/; max-age=0';
    }
  }

  return (
    <html lang="en-US" className="h-full">
      <body className="min-h-full bg-[#f5f5f0] flex items-center justify-center font-sans">
        <div className="w-full max-w-sm mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Resume Matcher
            </h1>
            <p className="text-sm text-[#666] mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 border border-[#d4d4d4] rounded-lg bg-white text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition"
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#1a1a1a] text-white rounded-lg font-medium hover:bg-[#333] transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </body>
    </html>
  );
}
