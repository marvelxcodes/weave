'use client';

interface Scene3DProps {
  bookOpen?: boolean;
  onBookInteract?: () => void;
}

export const Scene3D: React.FC<Scene3DProps> = () => {
  return (
    <div className="w-full h-screen">
      <video src="/bg.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
};