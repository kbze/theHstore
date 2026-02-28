import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border mt-20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo.png" alt="THE 8 STORE Logo" className="object-contain w-full h-full grayscale brightness-200" />
                            </div>
                            <h3 className="text-xl font-black tracking-tighter uppercase">The 8 Store</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Premium clothing brand delivering exceptional black and white aesthetics for the modern era.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold uppercase tracking-widest text-sm mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-foreground transition-colors">Shop All</Link></li>
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold uppercase tracking-widest text-sm mb-4">Policies</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} The 8 Store. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <Link href="/admin" className="hover:text-foreground transition-colors">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
