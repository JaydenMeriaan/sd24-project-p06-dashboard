"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Inloggen mislukt");
      } else {
        setMessage(data.message || "Inloggen succesvol");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push('/overview'), 300);
      }
    } catch (err: any) {
      setError(err.message || "Netwerkfout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-dark-glass rounded-lg shadow-dark-xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-light mb-4">
            Inloggen
          </h1>
          <p className="text-lg text-green-500 light-text">
            Vul je gegevens in om je favoriete sdgs te kunnen selecteren op het SDG Dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold light-text mb-2">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Voer je e-mailadres in"
              className="w-full px-4 py-2 bg-navy-900/70 border border-yellow-600 rounded-lg light-text placeholder-navy-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold light-text mb-2">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer je wachtwoord in"
              className="w-full px-4 py-2 bg-navy-900/70 border border-yellow-600 rounded-lg light-text placeholder-navy-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-blue-200 hover:to-blue-500 light-text font-semibold shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105 rounded-lg disabled:opacity-60"
          >
            {loading ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-green-500 light-text">
            Nog geen account?{' '}
            <a
              href="/signup"
              className="bg-gradient-to-r from-yellow-500 to-green-600 hover:from-blue-200 hover:to-blue-500 light-text font-semibold shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105 rounded-lg px-3 py-2 inline-block"
            >
              Maak er een aan
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}