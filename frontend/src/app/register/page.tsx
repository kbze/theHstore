"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            let data;
            try {
                data = await res.json();
            } catch (err) {
                console.error("Failed to parse JSON response");
            }

            if (res.ok) {
                if (data) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                }
                router.push('/');
            } else {
                alert(data?.message || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-muted/30 p-8 border-2 border-border rounded-none shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Join The 8</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Create an account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold uppercase tracking-wider">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Store Customer"
                            className="input-field border-2 border-border focus:border-foreground w-full py-4 px-4 bg-background"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold uppercase tracking-wider">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="you@example.com"
                            className="input-field border-2 border-border focus:border-foreground w-full py-4 px-4 bg-background"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold uppercase tracking-wider">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="Create a password"
                            className="input-field border-2 border-border focus:border-foreground w-full py-4 px-4 bg-background"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className={`btn-primary w-full ${loading ? 'opacity-50' : ''}`} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-foreground border-b border-foreground pb-0.5 uppercase tracking-wider">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
