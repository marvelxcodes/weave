'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleSystem: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions within the room
      positions[i3] = (Math.random() - 0.5) * 15; // x
      positions[i3 + 1] = Math.random() * 8; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 15; // z

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01; // x velocity
      velocities[i3 + 1] = Math.random() * 0.005 + 0.002; // y velocity (upward)
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01; // z velocity
    }

    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update positions based on velocities
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Add some floating motion
      positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.0005;
      positions[i3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.0005;

      // Reset particles that go too high or out of bounds
      if (positions[i3 + 1] > 8) {
        positions[i3 + 1] = 0;
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
      }

      // Keep particles within room bounds
      if (Math.abs(positions[i3]) > 7.5) {
        velocities[i3] *= -1;
      }
      if (Math.abs(positions[i3 + 2]) > 7.5) {
        velocities[i3 + 2] *= -1;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}; 