"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(data));
                router.push('/');
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-muted/30 p-8 border-2 border-border rounded-none shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Welcome Back</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold uppercase tracking-wider">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="Enter your email..."
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
                            placeholder="Enter your password..."
                            className="input-field border-2 border-border focus:border-foreground w-full py-4 px-4 bg-background"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="accent-foreground w-4 h-4 rounded-none border-border" />
                            <span className="text-gray-600">Remember Me</span>
                        </label>
                        <Link href="#" className="font-semibold border-b border-foreground uppercase tracking-widest text-xs">Forgot?</Link>
                    </div>

                    <button type="submit" className={`btn-primary w-full ${loading ? 'opacity-50' : ''}`} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-foreground border-b border-foreground pb-0.5 uppercase tracking-wider">
                        Create One
                    </Link>
                </div>
            </div>
        </div>
    );
}
