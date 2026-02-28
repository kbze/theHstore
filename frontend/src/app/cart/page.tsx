"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, isMounted } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
            alert('Please Log In or Create an Account to proceed with your order.');
            router.push('/login');
            return;
        }
        router.push('/checkout');
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 pb-4 border-b border-border">
                Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-xl text-gray-500 uppercase tracking-widest mb-8">Your cart is empty</p>
                    <Link href="/" className="btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-border">
                                <div className="w-full sm:w-32 h-40 bg-muted relative shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-gray-500 mt-1">Size: {item.size}</p>
                                        </div>
                                        <p className="text-xl font-medium">${item.price}</p>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center border border-border">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-4 py-2 hover:bg-muted transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-4 py-2 hover:bg-muted transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-sm border-b border-foreground text-foreground uppercase tracking-wider pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 border border-border p-8 h-fit sticky top-28 bg-background">
                        <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>${shipping}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold uppercase tracking-widest mb-8 pt-4 border-t border-border">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>

                        <button onClick={handleCheckout} className="btn-primary w-full text-center block">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
