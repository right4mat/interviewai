"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface WireframeSphereProps {
  participantName: string;
  isAISpeaking: boolean;
  isGettingReply: boolean;
  volumeLevel: number;
}

function Points({ isAISpeaking, isGettingReply, volumeLevel }: Omit<WireframeSphereProps, "participantName">) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const frameRef = useRef(0);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const isInitializedRef = useRef(false);
  const lastVolumeLevelRef = useRef(0);
  const pulseWavesRef = useRef<{ position: number; strength: number }[]>([]);

  React.useEffect(() => {
    if (isInitializedRef.current) return;
    
    const positions = [];
    const vertices = 2000;
    
    // Generate points in a sphere pattern
    for (let i = 0; i < vertices; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);
    }

    const positionsArray = new Float32Array(positions);
    positionsRef.current = positionsArray;
    originalPositionsRef.current = positionsArray.slice();

    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
      geometryRef.current.computeBoundingSphere();
    }

    isInitializedRef.current = true;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !positionsRef.current || !originalPositionsRef.current || !geometryRef.current) return;

    frameRef.current += 0.01;
    const frame = frameRef.current;

    const positions = positionsRef.current;
    const originalPositions = originalPositionsRef.current;

    // Detect significant volume changes to create new pulse waves
    const volumeChange = volumeLevel - lastVolumeLevelRef.current;
    if (isAISpeaking && volumeChange > 0.1) {
      pulseWavesRef.current.push({
        position: 0,
        strength: Math.min(volumeChange * 2, 1)
      });
    }
    lastVolumeLevelRef.current = volumeLevel;

    // Update and clean up pulse waves
    pulseWavesRef.current = pulseWavesRef.current.filter(wave => {
      wave.position += 0.15; // Wave speed
      return wave.position < Math.PI; // Remove waves that have completed
    });

    // Update positions based on pulse waves and volume
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];
      
      // Calculate base position with subtle constant animation
      const baseOffset = Math.sin(frame + Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2) * 2) * 0.02;
      
      let radiusMultiplier = 1 + baseOffset;

      if (isGettingReply) {
        // Simple pulse for reply state
        radiusMultiplier += Math.sin(frame * 3) * 0.05;
      } else if (isAISpeaking) {
        // Add effect from each active pulse wave
        for (const wave of pulseWavesRef.current) {
          const distance = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);
          const waveEffect = Math.sin(distance * 8 - wave.position * 2) * 
                           Math.exp(-wave.position * 0.5) * // Decay over distance
                           wave.strength * 0.1; // Scale the effect
          radiusMultiplier += waveEffect;
        }
        
        // Enhanced immediate volume response with multi-frequency animation
        const fastOsc = Math.sin(frame * 12 + Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2) * 4);
        const mediumOsc = Math.sin(frame * 8 + Math.sqrt(originalX ** 2 + originalZ ** 2) * 3);
        const slowOsc = Math.sin(frame * 4 + Math.sqrt(originalY ** 2 + originalZ ** 2) * 2);
        
        const combinedOsc = (fastOsc * 0.3 + mediumOsc * 0.5 + slowOsc * 0.2) * 0.5 + 0.5;
        const volumeResponse = combinedOsc * (volumeLevel/2) * 0.05;
        radiusMultiplier += volumeResponse;
      }

      positions[i] = originalX * radiusMultiplier;
      positions[i + 1] = originalY * radiusMultiplier;
      positions[i + 2] = originalZ * radiusMultiplier;
    }

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometryRef.current.attributes.position.needsUpdate = true;

    // Constant slow rotation
    pointsRef.current.rotation.y = frame * 0.1;
    pointsRef.current.rotation.x = frame * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positionsRef.current ? positionsRef.current.length / 3 : 0}
          array={positionsRef.current || new Float32Array()}
          itemSize={3}
          needsUpdate={true}
          args={[new Float32Array(), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={isGettingReply ? 0xff4444 : 0x4a90e2}
        size={0.02}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}

export const WireframeSphere = ({ isAISpeaking, isGettingReply, volumeLevel, participantName }: WireframeSphereProps) => {
  return (
    <div style={{ width: "35vw", height: "35vw", opacity: isGettingReply ? 0.9 : 0.8 }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Points isAISpeaking={isAISpeaking} isGettingReply={isGettingReply} volumeLevel={volumeLevel} />
      </Canvas>
    </div>
  );
};

export default WireframeSphere;
