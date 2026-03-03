"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function ParticleSwarm(props: any) {
    const ref = useRef<any>();

    // Generate 5000 particles within a sphere of radius 1.5
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }), []);

    useFrame((state, delta) => {
        if (ref.current) {
            // Slowly rotate the entire particle field
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

export default function ParticleBackground() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleSwarm />
            </Canvas>
            {/* Add a subtle vignette/gradient overlay so text remains readable */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none opacity-80" />
        </div>
    );
}
