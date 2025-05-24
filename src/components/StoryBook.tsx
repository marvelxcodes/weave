'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface StoryBookProps {
  isOpen?: boolean;
  onInteract?: () => void;
}

export const StoryBook: React.FC<StoryBookProps> = ({ 
  isOpen = false, 
  onInteract 
}) => {
  const bookRef = useRef<THREE.Group>(null);
  const leftPageRef = useRef<THREE.Mesh>(null);
  const rightPageRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (bookRef.current) {
      // Gentle floating animation
      bookRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Subtle rotation when hovered
      if (hovered) {
        bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
    }

    // Animate page opening
    if (leftPageRef.current && rightPageRef.current) {
      const targetRotation = isOpen ? -Math.PI * 0.8 : 0;
      leftPageRef.current.rotation.y = THREE.MathUtils.lerp(
        leftPageRef.current.rotation.y,
        targetRotation,
        0.05
      );
      rightPageRef.current.rotation.y = THREE.MathUtils.lerp(
        rightPageRef.current.rotation.y,
        -targetRotation,
        0.05
      );
    }
  });

  return (
    <group
      ref={bookRef}
      position={[0, 1.6, 3]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onInteract}
    >
      {/* Book spine/base */}
      <Box args={[2, 0.1, 1.5]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#4a2c17"
          roughness={0.8}
          metalness={0.1}
        />
      </Box>

      {/* Left page */}
      <mesh
        ref={leftPageRef}
        position={[-0.01, 0.051, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 0.01, 1.5]} />
        <meshStandardMaterial
          color="#f4f1e8"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right page */}
      <mesh
        ref={rightPageRef}
        position={[0.01, 0.051, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 0.01, 1.5]} />
        <meshStandardMaterial
          color="#f4f1e8"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Book title on cover */}
      {!isOpen && (
        <Text
          position={[0, 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.15}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"

        >
          WEAVE
          {'\n'}
          Tales of Choice
        </Text>
      )}

      {/* Magical glow effect */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={hovered ? 0.3 : 0.1}
        color="#d4af37"
        distance={2}
      />

      {/* Floating particles around the book */}
      {hovered && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.5,
                0.2 + Math.sin(Date.now() * 0.001 + i) * 0.1,
                Math.sin((i / 8) * Math.PI * 2) * 1.5
              ]}
            >
              <sphereGeometry args={[0.01, 4, 4]} />
              <meshBasicMaterial
                color="#d4af37"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}; 