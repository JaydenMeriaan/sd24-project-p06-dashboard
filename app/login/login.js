"use client";

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Registreren</button>
      {message && <p>{message}</p>}
    </form>
  );
}
