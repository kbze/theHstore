"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface OrderCompleteData {
    id: string;
    formData: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phoneNumber: string;
    };
    cartItems: {
        id: string;
        productId: string;
        name: string;
        price: number;
        quantity: number;
        size: string;
        image?: string;
    }[];
    subtotal: number;
    shipping: number;
    total: number;
}

export default function CheckoutPage() {
    const { cartItems, getCartTotal, clearCart, isMounted } = useCart();

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState<OrderCompleteData | null>(null);

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) return;

        setIsSubmitting(true);

        try {
            const userInfoStr = localStorage.getItem('userInfo');
            let token = '';
            if (userInfoStr) {
                const userInfo = JSON.parse(userInfoStr);
                token = userInfo.token;
            }

            // Send JSON to backend to create the order
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        product: item.productId || item.id.split('-')[0],
                        name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalAmount: total,
                    shippingDetails: formData
                })
            });

            let orderId = "TBD";
            if (res.ok) {
                const data = await res.json();
                orderId = data._id;

                // Show success screen instead of immediate redirect
                setOrderComplete({
                    id: orderId,
                    formData,
                    cartItems: [...cartItems],
                    subtotal,
                    shipping,
                    total
                });

                // Clear the cart securely after the snapshot is taken
                clearCart();
            } else {
                const errorData = await res.json();
                console.error("Backend error:", errorData);
                alert(`Error saving order: ${errorData.message || 'Please try again.'}`);
                setIsSubmitting(false);
            }

        } catch (error) {
            console.error("Order submission error:", error);
            setIsSubmitting(false);
            alert("An error occurred while creating your order. Please make sure you are logged in.");
        }
    };

    const handleWhatsAppRedirect = () => {
        if (!orderComplete) return;

        const { id, formData, cartItems, subtotal, shipping, total } = orderComplete;
        const phoneNumber = "905488755855"; // The merchant's number

        let message = `*NEW ORDER* (${id})\n\n`;
        message += `*Customer Details*\n`;
        message += `Name: ${formData.fullName}\n`;
        message += `Phone: ${formData.phoneNumber}\n`;
        message += `Address: ${formData.address}, ${formData.city} - ${formData.postalCode}\n\n`;

        message += `*Order Items*\n`;
        cartItems.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (${item.size}) : $${item.price * item.quantity}\n`;
        });

        message += `\n*Subtotal*: $${subtotal}\n`;
        message += `*Shipping*: $${shipping}\n`;
        message += `*Total*: $${total}\n\n`;
        message += `_Please review my order above. I will attach the receipt for my Sham Cash transfer here shortly._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        window.location.href = '/'; // send back to home
    };

    if (!isMounted) return null;

    if (orderComplete) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-muted p-8 border border-border text-center mb-8">
                    <div className="w-full max-w-2xl mx-auto mb-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/thank-you.png" alt="Thank You for your order" className="w-full h-auto object-contain" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Confirmed</h1>
                    <p className="text-gray-600 mb-6">Order #{orderComplete.id}</p>

                    <div className="bg-background border border-border p-6 text-left mb-8 max-w-lg mx-auto">
                        <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">Order Receipt</h3>
                        <div className="space-y-2 mb-4">
                            {orderComplete.cartItems.map((item, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.name} ({item.size})</span>
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border pt-2 text-sm">
                            <div className="flex justify-between font-bold">
                                <span>Total (inc. Shipping)</span>
                                <span>${orderComplete.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-foreground/5 p-6 mb-8 max-w-lg mx-auto border-l-4 border-foreground text-left">
                        <h4 className="font-bold uppercase tracking-wider mb-2">Final Step: Payment</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                            Your order has been saved successfully! To finalize your purchase, please transfer <strong>${orderComplete.total}</strong> via Sham Cash to <strong>0912-345-678</strong>.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Click the button below to message us on WhatsApp with your pre-filled order details. <strong>You must reply there with your transfer screenshot</strong>.
                        </p>
                    </div>

                    <button
                        onClick={handleWhatsAppRedirect}
                        className="btn-primary w-full max-w-md mx-auto flex items-center justify-center gap-3 text-lg py-4 bg-green-600 hover:bg-green-700 text-white border-0"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 2.806.928 3.181 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.757-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938 0 3.825-3.113 6.938-6.938 6.938z" />
                        </svg>
                        Send Receipt via WhatsApp
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">Checkout</h1>
                <p className="text-xl text-gray-500 uppercase tracking-widest mb-8">Your cart is empty</p>
                <Link href="/" className="btn-primary inline-block">
                    Return to Store
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 pb-4 border-b border-border">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Shipping Info */}
                        <section>
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-2">1. Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input required type="text" name="fullName" placeholder="Full Name" className="input-field md:col-span-2" onChange={handleChange} />
                                <input required type="text" name="address" placeholder="Street Address" className="input-field md:col-span-2" onChange={handleChange} />
                                <input required type="text" name="city" placeholder="City / Emirate" className="input-field" onChange={handleChange} />
                                <input required type="text" name="postalCode" placeholder="Postal Code" className="input-field" onChange={handleChange} />
                                <input required type="tel" name="phoneNumber" placeholder="Phone Number" className="input-field md:col-span-2" onChange={handleChange} />
                            </div>
                        </section>

                        {/* Payment Info */}
                        <section>
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-2">2. Payment Method</h2>

                            <div className="bg-muted p-6 border border-border">
                                <h3 className="font-bold uppercase tracking-wider text-xl mb-4">Sham Cash Transfer</h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    We exclusively accept payments via Sham Cash. Please transfer the total amount of <strong className="text-foreground text-lg">${total}</strong> to the following account:
                                </p>
                                <div className="bg-background border border-border p-6 text-center font-mono text-3xl font-bold tracking-widest mb-6">
                                    0912-345-678
                                </div>
                                <div className="flex items-start gap-4 text-sm text-gray-600">
                                    <svg className="w-8 h-8 shrink-0 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>
                                        <strong>Important:</strong> After clicking &quot;Place Order &amp; Verify on WhatsApp&quot; below, you will be redirected to our WhatsApp line with your order details pre-filled. <strong>You must reply with a screenshot / photo of your Sham Cash transfer receipt there</strong> to successfully complete your order.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order & Verify on WhatsApp'}
                            {!isSubmitting && (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 2.806.928 3.181 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.757-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938 0 3.825-3.113 6.938-6.938 6.938z" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5 bg-muted p-8 border border-border h-fit sticky top-28">
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-gray-600 border-b border-border/50 pb-3">
                                <span className="pr-4">{item.name} (Size: {item.size}) <br /><span className="text-xs">Qty: {item.quantity}</span></span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-gray-600 pt-2">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>${shipping}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-2xl font-black uppercase tracking-widest pt-4 border-t border-border">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
