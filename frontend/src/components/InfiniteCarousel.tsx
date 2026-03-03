"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    sizes: string[];
}

interface CarouselProps {
    products: Product[];
}

function Card({ product, url, index, total, radius = 2.5 }: { product: Product, url: string, index: number, total: number, radius?: number }) {
    const ref = useRef<any>(null);
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    // Calculate position in circle
    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // Make card look towards center
    const yRotation = Math.atan2(x, z);

    useFrame((state, delta) => {
        if (ref.current) {
            // Gentle hover floating
            ref.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.1;

            // Scale up on hover
            const targetScale = hovered ? 1.1 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group position={[x, 0, z]} rotation={[0, yRotation, 0]}>
            <Image
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => router.push(`/product/${product._id}`)}
                scale={[1.5, 2]} // Aspect ratio of cards 3:4
            />
        </group>
    );
}

function CarouselScene({ products }: { products: Product[] }) {
    const groupRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [targetRotation, setTargetRotation] = useState(0);

    // Smooth rotation follow
    useFrame(() => {
        if (groupRef.current) {
            // Lerp current rotation to target rotation for smooth dragging momentum
            groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.05;

            // Auto-rotate slowly when not dragging
            if (!isDragging) {
                setTargetRotation(prev => prev + 0.002);
            }
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerDown={(e) => {
                setIsDragging(true);
                setStartX(e.clientX);
                // Stop bubbling so the canvas doesn't steal the event
                e.stopPropagation();
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            onPointerMove={(e) => {
                if (isDragging) {
                    const delta = (e.clientX - startX) * 0.01;
                    setTargetRotation(prev => prev + delta);
                    setStartX(e.clientX);
                }
            }}
        >
            {products.map((product, i) => {
                const imageUrl = product.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.image}` : product.image;
                return (
                    <Card
                        key={product._id}
                        product={product}
                        url={imageUrl}
                        index={i}
                        total={products.length}
                        radius={products.length * 0.6} // Dynamic radius based on item count
                    />
                );
            })}
        </group>
    );
}

export default function InfiniteCarousel({ products }: CarouselProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="w-full h-[600px] cursor-grab active:cursor-grabbing relative">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <CarouselScene products={products} />
                <Environment preset="city" />
            </Canvas>
            <div className="absolute bottom-4 left-0 w-full text-center text-sm text-gray-400 uppercase tracking-widest pointer-events-none">
                Drag to explore collection
            </div>
        </div>
    );
}
