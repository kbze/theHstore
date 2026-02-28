"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems, isMounted } = useCart();
    const router = useRouter();

    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        if (isMounted) {
            const userInfostr = localStorage.getItem('userInfo');
            if (userInfostr) {
                setUser(JSON.parse(userInfostr));
            }
        }
    }, [isMounted]);

    const handleLogout = () => {
        setIsMenuOpen(false);
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo.png" alt="THE 8 STORE Logo" className="object-contain w-full h-full" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase hidden sm:block">
                                The 8 Store
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors">Shop</Link>
                        <Link href="/cart" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors flex items-center gap-2">
                            Cart
                            {isMounted && (
                                <span className="bg-foreground text-background text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="h-4 w-px bg-border"></div>

                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-medium tracking-widest uppercase text-gray-500">HI, {user.name}</span>
                                <button onClick={handleLogout} className="text-sm font-medium tracking-widest uppercase hover:text-red-500 transition-colors">
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link href="/login" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors">Log In</Link>
                                <Link href="/register" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 transition-colors bg-foreground text-background px-4 py-2 hover:bg-black/80">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-foreground hover:text-gray-500 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-background border-b border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium uppercase tracking-widest hover:bg-muted">Shop</Link>
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium uppercase tracking-widest hover:bg-muted">Cart ({cartCount})</Link>
                        {user ? (
                            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium uppercase tracking-widest hover:bg-muted text-red-500">Log Out</button>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium uppercase tracking-widest hover:bg-muted">Log In</Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium uppercase tracking-widest hover:bg-muted">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
