'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { AntiqueRoom } from './AntiqueRoom';
import { StoryBook } from './StoryBook';
import { ParticleSystem } from './ParticleSystem';

interface Scene3DProps {
  bookOpen?: boolean;
  onBookInteract?: () => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ bookOpen = false, onBookInteract }) => {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} color="#f4f1e8" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            color="#d4af37"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight
            position={[-5, 5, -5]}
            intensity={0.5}
            color="#cd7f32"
            castShadow
          />

          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* 3D Scene Elements */}
          <AntiqueRoom />
          <StoryBook isOpen={bookOpen} onInteract={onBookInteract} />
          <ParticleSystem />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            target={[0, 2, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}; 