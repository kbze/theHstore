"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TiltCard from '@/components/TiltCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we would fetch from our Express backend
  // For the sake of the initial UI, let's use some placeholder data if fetch fails
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          loadFallbackProducts();
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        loadFallbackProducts();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbackProducts = () => {
      setProducts([
        {
          _id: '1',
          name: 'Noir Emblem Zip-Up Hoodie',
          price: 35,
          image: '/images/product1.png',
          sizes: ['S', 'M', 'L', 'XL']
        },
        {
          _id: '2',
          name: 'Noir Emblem Sweatpants',
          price: 35,
          image: '/images/product2.png',
          sizes: ['S', 'M', 'L', 'XL']
        },
        {
          _id: '3',
          name: 'Syria Pullover Hoodie',
          price: 35,
          image: '/images/product3.png',
          sizes: ['S', 'M', 'L', 'XL']
        },
        {
          _id: '4',
          name: 'Syria Pullover II',
          price: 35,
          image: '/images/product4.png',
          sizes: ['S', 'M', 'L', 'XL']
        },
        {
          _id: '5',
          name: 'Syria Zip-Up Hoodie',
          price: 35,
          image: '/images/product5.png',
          sizes: ['S', 'M', 'L', 'XL']
        }
      ]);
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section
        className="w-full h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-4 relative bg-black bg-[length:contain] sm:bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.png')"
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 animate-fade-in-up text-white drop-shadow-lg">
            Define Your <br /> Aesthetic
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-gray-200 mb-10 opacity-90 drop-shadow-md">
            Uncompromising quality. Monochromatic perfection. Discover the latest collection.
          </p>
          <Link href="#collection" className="btn-primary bg-white text-black hover:bg-gray-200">
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section id="collection" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
          <h2 className="text-3xl font-bold uppercase tracking-widest">New Arrivals</h2>
          <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{products.length} Items</span>
        </div>



        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="group cursor-pointer block perspective-[1000px]">
                <TiltCard className="aspect-[3/4] mb-6 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.image}` : product.image}
                    alt={product.name}
                    className="object-contain w-full h-full transform transition-transform duration-700 group-hover:scale-105 drop-shadow-md"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center translate-z-[100px]">
                    <div className="btn-primary text-center bg-background text-foreground w-11/12 pointer-events-none shadow-2xl">
                      View Product
                    </div>
                  </div>
                </TiltCard>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.sizes.join(', ')}</p>
                  </div>
                  <p className="text-lg font-semibold">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Brand Ethos */}
      <section className="w-full bg-muted py-24 px-4 text-center mt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black uppercase tracking-widest mb-6">The 8 Philosophy</h2>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            We believe in the power of simplicity. Black and white are not just colors; they are a statement of intent. A rejection of the unnecessary. A focus on pure form, texture, and silhouette.
          </p>
        </div>
      </section>
    </div>
  );
}
