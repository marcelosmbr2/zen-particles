import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { generateParticles } from '../utils/shapes';
import { ShapeType } from '../types';

const ParticleSystem = () => {
  const { shape, color, particleCount, handDistance, handDetected, gestureTension } = useAppStore();
  const pointsRef = useRef<THREE.Points>(null);
  
  // Buffers for animation
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const targetPositions = useMemo(() => generateParticles(shape, particleCount), [shape, particleCount]);
  
  // Store initial random positions
  useEffect(() => {
    const initial = generateParticles(ShapeType.SPHERE, particleCount);
    currentPositions.set(initial);
  }, [particleCount, currentPositions]);

  // Update target when shape changes
  useEffect(() => {
    const newTarget = generateParticles(shape, particleCount);
    targetPositions.set(newTarget);
  }, [shape, particleCount, targetPositions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Smooth lerp factor
    const lerpSpeed = 3.0 * delta;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Interactive factors
    // If no hand detected, auto-breathe
    const breathe = Math.sin(state.clock.elapsedTime) * 0.2 + 1;
    
    // Expansion factor: Controlled by hand distance. 
    // If hands far apart (high distance) -> Expand.
    const expansionBase = handDetected ? (handDistance * 2.5 + 0.5) : breathe;
    
    // Tension factor: Controlled by fist clench.
    // High tension -> Jitter/Noise
    const tension = handDetected ? gestureTension : 0;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 1. Interpolate towards target shape
      const tx = targetPositions[i3];
      const ty = targetPositions[i3 + 1];
      const tz = targetPositions[i3 + 2];

      // Current pos
      let cx = positions[i3];
      let cy = positions[i3 + 1];
      let cz = positions[i3 + 2];

      // Move towards target
      cx += (tx - cx) * lerpSpeed;
      cy += (ty - cy) * lerpSpeed;
      cz += (tz - cz) * lerpSpeed;

      // 2. Apply Expansion (Scale from center)
      // Vector from center
      const len = Math.sqrt(cx*cx + cy*cy + cz*cz) || 0.001;
      const nx = cx / len;
      const ny = cy / len;
      const nz = cz / len;

      const finalScale = expansionBase;
      
      // 3. Apply Tension (Jitter)
      const jitter = tension * 0.2; // Max jitter amount
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      const jz = (Math.random() - 0.5) * jitter;

      positions[i3] = cx + (cx * (finalScale - 1)) + jx;
      positions[i3+1] = cy + (cy * (finalScale - 1)) + jy;
      positions[i3+2] = cz + (cz * (finalScale - 1)) + jz;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate entire system slowly
    pointsRef.current.rotation.y += delta * 0.1 * (1 + tension * 5); // Spin faster on tension
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Scene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <ParticleSystem />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Scene;
