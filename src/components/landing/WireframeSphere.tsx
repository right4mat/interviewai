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
  const pointAnimationStatesRef = useRef<number[]>([]);

  React.useEffect(() => {
    if (isInitializedRef.current) return;
    
    // Create points for sphere
    const positions = [];
    const vertices = 2000;
    
    // Initialize animation states for each point
    pointAnimationStatesRef.current = Array(vertices).fill(0);

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

    frameRef.current += 0.002; // Constant rotation speed
    const frame = frameRef.current;

    const positions = positionsRef.current;
    const originalPositions = originalPositionsRef.current;
    const animationStates = pointAnimationStatesRef.current;

    // Randomly select points to animate based on volume level
    if (isAISpeaking) {
      const pointsToAnimate = Math.floor(volumeLevel * 100);
      for (let i = 0; i < pointsToAnimate; i++) {
        const randomIndex = Math.floor(Math.random() * animationStates.length);
        if (animationStates[randomIndex] === 0) {
          animationStates[randomIndex] = 1;
        }
      }
    }

    // Update positions based on animation states
    for (let i = 0; i < positions.length; i += 3) {
      const pointIndex = i / 3;
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      let radiusMultiplier = 1;

      if (isGettingReply) {
        radiusMultiplier = 1 + Math.sin(frame) * 0.2;
      } else {
        // Smoothly animate points
        if (animationStates[pointIndex] > 0) {
          radiusMultiplier = 1 + Math.sin(animationStates[pointIndex]) * 0.1;
          animationStates[pointIndex] += 0.1;
          if (animationStates[pointIndex] >= Math.PI) {
            animationStates[pointIndex] = 0;
          }
        } else {
          radiusMultiplier = 1 + Math.sin(frame * 0.5) * 0.05;
        }
      }

      positions[i] = originalX * radiusMultiplier;
      positions[i + 1] = originalY * radiusMultiplier;
      positions[i + 2] = originalZ * radiusMultiplier;
    }

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometryRef.current.attributes.position.needsUpdate = true;

    // Constant rotation speed
    const rotationSpeed = isGettingReply ? 0.2 : 0.05;
    pointsRef.current.rotation.y = frame * rotationSpeed;
    pointsRef.current.rotation.x = frame * (rotationSpeed * 0.5);
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
