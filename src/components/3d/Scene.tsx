import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Deterministic pseudo-random sequence for stable particle placement
function createDeterministicPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  let seed = 42;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (lcg() - 0.5) * 12;
    pos[i * 3 + 1] = (lcg() - 0.5) * 10;
    pos[i * 3 + 2] = (lcg() - 0.5) * 6;
  }
  return pos;
}

const STATIC_POSITIONS_35 = createDeterministicPositions(35);

function AmbientParticles({ count = 35 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = React.useMemo(() => {
    return count === 35 ? STATIC_POSITIONS_35 : createDeterministicPositions(count);
  }, [count]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#10b981"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

export const Scene: React.FC = () => {
  const [reducedMotion, setReducedMotion] = React.useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <AmbientParticles count={35} />
      </Canvas>
    </div>
  );
};
