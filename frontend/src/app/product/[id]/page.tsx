"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    sizes: string[];
    description?: string;
}

export default function ProductDetails() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');

    useEffect(() => {
        // We try to fetch from backend, if it fails or returns 404 (due to unseeded DB), use fallbacks
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
                } else {
                    loadFallback();
                }
            } catch {
                loadFallback();
            } finally {
                setLoading(false);
            }
        }

        const loadFallback = () => {
            const fallbacks: Product[] = [
                { _id: '1', name: 'Noir Emblem Zip-Up Hoodie', price: 35, image: '/images/product1.png', sizes: ['S', 'M', 'L', 'XL'], description: 'Premium zip-up hoodie featuring the H emblem and signature Syria back graphic.' },
                { _id: '2', name: 'Noir Emblem Sweatpants', price: 35, image: '/images/product2.png', sizes: ['S', 'M', 'L', 'XL'], description: 'Comfortable and stylish sweatpants perfectly matching the Noir Emblem collection.' },
                { _id: '3', name: 'Syria Pullover Hoodie', price: 35, image: '/images/product3.png', sizes: ['S', 'M', 'L', 'XL'], description: 'Classic pullover hoodie with bold back graphic design.' },
                { _id: '4', name: 'Syria Pullover II', price: 35, image: '/images/product4.png', sizes: ['S', 'M', 'L', 'XL'], description: 'Alternative edition of the classic pullover with slightly varying graphic placement.' },
                { _id: '5', name: 'Syria Zip-Up Hoodie', price: 35, image: '/images/product5.png', sizes: ['S', 'M', 'L', 'XL'], description: 'Signature zip-up hoodie featuring the iconic crest on the back.' }
            ];
            const match = fallbacks.find(p => p._id === params.id) || fallbacks[0];
            setProduct(match);
            if (match.sizes?.length > 0) setSelectedSize(match.sizes[0]);
        };

        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product || !selectedSize) return;

        addToCart({
            id: `${product._id}-${selectedSize}`,
            productId: product._id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1,
            image: product.image
        });

        router.push('/cart');
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div></div>;
    }

    if (!product) {
        return <div className="min-h-[60vh] flex items-center justify-center">Product not found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    /></div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{product.name}</h1>
                    <p className="text-2xl font-medium mb-8">${product.price}</p>

                    {product.description && (
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold uppercase tracking-wider text-sm">Size</span>
                        </div>
                        <div className="flex gap-4">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 flex items-center justify-center border transition-all ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground hover:border-gray-400'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="btn-primary w-full py-5 text-lg"
                    >
                        Add to Cart
                    </button>

                    <div className="mt-8 pt-8 border-t border-border space-y-4 text-sm text-gray-500">
                        <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> In stock and ready to ship</p>
                        <p>Exclusive quality, monochromatic perfection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
