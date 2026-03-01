"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    // Redirect to dashboard if already logged in as admin
    useEffect(() => {
        const userInfoStr = localStorage.getItem('adminInfo');
        if (userInfoStr) {
            const user = JSON.parse(userInfoStr);
            if (user.role === 'admin') {
                router.push('/');
            }
        }
    }, [router]);

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
                if (data.role === 'admin') {
                    // Save as adminInfo to avoid conflicts with the storefront
                    localStorage.setItem('adminInfo', JSON.stringify(data));
                    router.push('/');
                } else {
                    alert('Access Denied: You do not have admin privileges.');
                }
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage THE 8 STORE</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition text-black"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition text-black"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-900 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
