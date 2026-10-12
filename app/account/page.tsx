"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
};

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data?.user) {
                    setUser(data.user);
                    setName(data.user.name || "");
                    setEmail(data.user.email || "");
                } else {
                    setUser(null);
                }
            } catch (err: any) {
                setError(err?.message || "Kon gebruiker niet laden");
            }
        }
        fetchUser();
    }, []);

    async function handleUpdate(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch(`/api/account/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password: password || undefined, currentPassword: password ? currentPassword : undefined }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Bijwerken mislukt");
            } else {
                setMessage(data.message || "Account bijgewerkt");
                setUser(data.user || user);
                setPassword("");
            }
        } catch (err: any) {
            setError(err?.message || "Netwerkfout");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Weet je zeker dat je je account wilt verwijderen? Dit is permanent.")) return;
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch(`/api/account/delete`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Verwijderen mislukt");
            } else {
                setMessage(data.message || "Account verwijderd");
                // Redirect to home or signup after deletion
                setTimeout(() => router.push("/"), 500);
            }
        } catch (err: any) {
            setError(err?.message || "Netwerkfout");
        } finally {
            setLoading(false);
        }
    }

    if (user === null) {
        return (
            <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
                <div className="max-w-md w-full p-8 bg-dark-glass rounded-lg">
                    <p className="light-text">Geen ingelogde gebruiker gevonden.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
            <div className="max-w-lg w-full p-8 bg-dark-glass rounded-lg shadow-dark-xl">
                <h2 className="text-2xl font-bold mb-4 light-text">Accountinstellingen</h2>

                <div className="flex items-center gap-4 mb-6">
                    {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatarUrl} alt="Profielfoto" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="text-sm light-text font-medium">{user.name}</div>
                        <div className="text-xs text-navy-200 light-text">{user.email}</div>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleUpdate}>
                    <div>
                        <label className="block text-sm font-semibold light-text mb-2">Naam</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-navy-900/70 border border-purple-600/30 rounded-lg light-text"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold light-text mb-2">E-mailadres</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-navy-900/70 border border-purple-600/30 rounded-lg light-text"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold light-text mb-2">Huidig wachtwoord (verplicht bij wijzigen)</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-navy-900/70 border border-purple-600/30 rounded-lg light-text"
                                placeholder="Voer huidig wachtwoord in als je wil wijzigen"
                            />
                            <button type="button" onClick={() => setShowCurrentPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-300">
                                {showCurrentPassword ? 'Verberg' : 'Toon'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold light-text mb-2">Nieuw wachtwoord (optioneel)</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-navy-900/70 border border-purple-600/30 rounded-lg light-text"
                                placeholder="Laat leeg om wachtwoord te behouden"
                            />
                            <button type="button" onClick={() => setShowNewPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-300">
                                {showNewPassword ? 'Verberg' : 'Toon'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 light-text font-semibold rounded-lg"
                        >
                            {loading ? "Bezig..." : "Opslaan"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="py-3 px-4 bg-red-600 hover:bg-red-700 light-text rounded-lg"
                        >
                            Verwijder account
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    {message && <p className="text-sm text-green-400 light-text">{message}</p>}
                    {error && <p className="text-sm text-red-400 light-text">{error}</p>}
                </div>
            </div>
        </div>
    );
}