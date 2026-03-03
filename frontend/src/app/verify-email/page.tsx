"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Email verified successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setMessage(data.message || 'Invalid verification code.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-muted/30 p-8 border-2 border-border text-center shadow-xl">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Verify Email</h1>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">
                    We sent a 6-digit code to <br /> <strong className="text-foreground">{email}</strong>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            required
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            className="input-field border-2 border-border focus:border-foreground w-full py-4 px-4 bg-background text-center text-2xl tracking-[0.5em] font-bold uppercase"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                        />
                    </div>

                    <button type="submit" className={`btn-primary w-full ${loading ? 'opacity-50' : ''}`} disabled={loading || code.length !== 6}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                {message && (
                    <div className="mt-4 text-sm font-semibold p-3 border border-border bg-background">
                        {message}
                    </div>
                )}

                <div className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
                    <Link href="/login" className="border-b border-foreground text-foreground pb-0.5">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
            <VerifyEmailForm />
        </Suspense>
    );
}
