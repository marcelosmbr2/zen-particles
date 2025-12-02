import * as THREE from 'three';
import { ShapeType } from '../types';

export const generateParticles = (shape: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case ShapeType.SPHERE: {
        const r = 4 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
      case ShapeType.HEART: {
        // Parametric heart
        // x = 16sin^3(t)
        // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
        // Rotate to be 3D
        const t = Math.random() * 2 * Math.PI;
        const u = Math.random() * 2 * Math.PI; 
        // Base 2D heart
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        // Add depth
        const scale = 0.25;
        const r = 2 * (Math.random() - 0.5);
        x = hx * scale;
        y = hy * scale;
        z = r * (2 + Math.cos(t)) * scale * 2; // Thickness varies
        break;
      }
      case ShapeType.FLOWER: {
        // Rose curve-ish
        const k = 4; // petals
        const theta = Math.random() * 2 * Math.PI;
        const radius = 5 * Math.cos(k * theta);
        const depth = (Math.random() - 0.5) * 2;
        x = radius * Math.cos(theta);
        y = radius * Math.sin(theta);
        z = depth + (radius * 0.2); // Curve petals slightly
        break;
      }
      case ShapeType.SATURN: {
        const isRing = Math.random() > 0.4;
        if (isRing) {
          // Ring
          const innerR = 4.5;
          const outerR = 8.0;
          const r = innerR + Math.random() * (outerR - innerR);
          const theta = Math.random() * 2 * Math.PI;
          x = r * Math.cos(theta);
          z = r * Math.sin(theta);
          y = (Math.random() - 0.5) * 0.2; // Thin disk
        } else {
          // Planet body
          const r = 3.5 * Math.cbrt(Math.random());
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }
        // Tilt Saturn
        const tilt = 0.4;
        const tempX = x;
        const tempY = y;
        x = tempX * Math.cos(tilt) - tempY * Math.sin(tilt);
        y = tempX * Math.sin(tilt) + tempY * Math.cos(tilt);
        break;
      }
      case ShapeType.BUDDHA: {
        // Approximate a meditating figure with blobs
        const part = Math.random();
        
        if (part < 0.3) {
          // Base/Legs (Flat ellipsoid)
          const r = 3.5 * Math.sqrt(Math.random());
          const theta = Math.random() * Math.PI; // Half circle front
          x = r * Math.cos(theta * 2); 
          y = (Math.random() - 0.5) * 1.5 - 3; // Bottom
          z = r * Math.sin(theta * 2) * 0.5;
        } else if (part < 0.7) {
          // Body (Cylinder/Sphere)
          const r = 2 * Math.random();
          const h = (Math.random() - 0.5) * 4;
          const theta = Math.random() * 2 * Math.PI;
          x = r * Math.cos(theta);
          y = h;
          z = r * Math.sin(theta) * 0.8;
        } else {
           // Head
           const r = 1.2 * Math.cbrt(Math.random());
           const theta = Math.random() * 2 * Math.PI;
           const phi = Math.acos(2 * Math.random() - 1);
           x = r * Math.sin(phi) * Math.cos(theta);
           y = r * Math.sin(phi) * Math.sin(theta) + 3; // Shift up
           z = r * Math.cos(phi);
        }
        break;
      }
      case ShapeType.FIREWORKS: {
        // Explosion rays
        const r = 8 * Math.pow(Math.random(), 1/3); // Distribution
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }
  
  return positions;
};
