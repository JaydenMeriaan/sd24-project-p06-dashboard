"use client";

import { useState, FormEvent } from "react";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er ging iets mis bij registratie");
      } else {
        setMessage(data.message || "Account aangemaakt");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Netwerkfout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-dark-glass rounded-lg shadow-dark-xl transition-shadow duration-300 hover:shadow-dark-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-light mb-4">
            Registreren
          </h1>
          <p className="text-lg text-black light-text">
            Maak een nieuw account voor het SDG Dashboard
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold light-text mb-2">
              Naam
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Voer je naam in"
              className="w-full px-4 py-2 bg-navy-900/70 border border-yellow-600 rounded-lg light-text placeholder-navy-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

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
              placeholder="Maak een wachtwoord aan"
              className="w-full px-4 py-2 bg-navy-900/70 border border-yellow-600 rounded-lg light-text placeholder-navy-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-blue-200 hover:to-blue-500 light-text font-semibold shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105 rounded-lg disabled:opacity-60"
          >
            {loading ? "Bezig..." : "Account aanmaken"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {message && <p className="text-sm text-green-400 light-text">{message}</p>}
          {error && <p className="text-sm text-red-400 light-text">{error}</p>}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-black light-text">
            Heb je al een account?{" "}
            <a
              href="/login"
              className="bg-gradient-to-r from-yellow-500 to-green-600 hover:from-blue-200 hover:to-blue-500 light-text font-semibold shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105 rounded-lg px-3 py-2 inline-block"
            >
              Log in
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}