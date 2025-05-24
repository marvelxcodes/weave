'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export const AntiqueRoom: React.FC = () => {
  const floorRef = useRef<THREE.Mesh>(null);
  const candleFlameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Animate candle flame
    if (candleFlameRef.current) {
      candleFlameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      candleFlameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Floor */}
      <Plane
        ref={floorRef}
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#3c2415"
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Walls */}
      <Plane
        args={[20, 10]}
        position={[0, 5, -10]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      <Plane
        args={[20, 10]}
        position={[-10, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      <Plane
        args={[20, 10]}
        position={[10, 5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      {/* Bookshelves */}
      <group position={[-8, 0, -8]}>
        <Box args={[3, 6, 0.5]} position={[0, 3, 0]} castShadow>
          <meshStandardMaterial color="#4a2c17" roughness={0.7} />
        </Box>
        {/* Books */}
        {Array.from({ length: 15 }).map((_, i) => (
          <Box
            key={i}
            args={[0.15, 0.8, 0.3]}
            position={[
              -1.3 + (i % 5) * 0.3,
              1.5 + Math.floor(i / 5) * 1.2,
              0.1
            ]}
            castShadow
          >
            <meshStandardMaterial
              color={`hsl(${20 + i * 15}, 60%, ${30 + i * 3}%)`}
              roughness={0.8}
            />
          </Box>
        ))}
      </group>

      {/* Desk */}
      <group position={[0, 0, 3]}>
        <Box args={[4, 0.1, 2]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#4a2c17" roughness={0.6} />
        </Box>
        {/* Desk legs */}
        {[[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]].map(([x, z], i) => (
          <Box key={i} args={[0.1, 1.5, 0.1]} position={[x, 0.75, z]} castShadow>
            <meshStandardMaterial color="#3c2415" roughness={0.7} />
          </Box>
        ))}
      </group>

      {/* Candle */}
      <group position={[3, 1.6, 3]}>
        <Cylinder args={[0.05, 0.05, 0.3]} castShadow>
          <meshStandardMaterial color="#f4f1e8" roughness={0.3} />
        </Cylinder>
        {/* Flame */}
        <mesh ref={candleFlameRef} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.03, 8, 6]} />
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.8} />
        </mesh>
        {/* Flame glow */}
        <pointLight
          position={[0, 0.2, 0]}
          intensity={0.5}
          color="#ff6b35"
          distance={3}
        />
      </group>

      {/* Armchair */}
      <group position={[5, 0, -2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Seat */}
        <Box args={[1.5, 0.2, 1.5]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </Box>
        {/* Backrest */}
        <Box args={[1.5, 1.5, 0.2]} position={[0, 1.5, -0.65]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </Box>
        {/* Armrests */}
        <Box args={[0.2, 0.8, 1]} position={[-0.65, 1.2, -0.25]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </Box>
        <Box args={[0.2, 0.8, 1]} position={[0.65, 1.2, -0.25]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </Box>
      </group>

      {/* Carpet */}
      <Plane
        args={[6, 4]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <meshStandardMaterial
          color="#704214"
          roughness={0.9}
          transparent
          opacity={0.8}
        />
      </Plane>
    </group>
  );
}; 