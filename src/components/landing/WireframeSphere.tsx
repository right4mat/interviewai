"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { brand } from "@/theme/themePrimitives";

interface WireframeSphereProps {
  participantName: string;
  isAISpeaking: boolean;
  isGettingReply: boolean;
  volumeLevel: number;
}

// Convert brand colors to THREE.Color array for shimmering
const brandColors = [
  new THREE.Color(brand[200]),
  new THREE.Color(brand[300]),
  new THREE.Color(brand[400]),
  new THREE.Color(brand[500]),
  new THREE.Color(brand[600])
];

function Points({ isAISpeaking, isGettingReply, volumeLevel }: Omit<WireframeSphereProps, "participantName">) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const frameRef = useRef(0);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const isInitializedRef = useRef(false);
  const lastVolumeLevelRef = useRef(0);
  const pulseWavesRef = useRef<{ position: number; strength: number }[]>([]);

  React.useEffect(() => {
    if (isInitializedRef.current) return;
    
    const positions = [];
    const colors = [];
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
      
      // Initialize with base color
      const baseColor = new THREE.Color(0x4a90e2);
      colors.push(baseColor.r, baseColor.g, baseColor.b);
    }

    const positionsArray = new Float32Array(positions);
    const colorsArray = new Float32Array(colors);
    positionsRef.current = positionsArray;
    colorsRef.current = colorsArray;
    originalPositionsRef.current = positionsArray.slice();

    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
      geometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));
      geometryRef.current.computeBoundingSphere();
    }

    isInitializedRef.current = true;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !positionsRef.current || !originalPositionsRef.current || !geometryRef.current || !colorsRef.current) return;

    frameRef.current += 0.01;
    const frame = frameRef.current;

    const positions = positionsRef.current;
    const originalPositions = originalPositionsRef.current;
    const colors = colorsRef.current;

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
      wave.position += 0.15;
      return wave.position < Math.PI;
    });

    // Update positions and colors
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];
      
      const baseOffset = Math.sin(frame + Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2) * 2) * 0.01;
      let radiusMultiplier = 1 + baseOffset;

      if (isGettingReply) {
        // Enhanced shimmering effect with color variations
        radiusMultiplier += Math.sin(frame * 3) * 0.03;
        
        // Create unique shimmering pattern for each point
        const uniqueOffset = Math.sin(frame * 2 + i * 0.1);
        const colorIndex = Math.floor(((uniqueOffset + 1) / 2) * brandColors.length);
        const nextColorIndex = (colorIndex + 1) % brandColors.length;
        const lerpFactor = ((uniqueOffset + 1) / 2) * brandColors.length - colorIndex;
        
        const currentColor = brandColors[colorIndex];
        const nextColor = brandColors[nextColorIndex];
        
        // Interpolate between colors
        const finalColor = new THREE.Color().lerpColors(currentColor, nextColor, lerpFactor);
        
        colors[i] = finalColor.r;
        colors[i + 1] = finalColor.g;
        colors[i + 2] = finalColor.b;
      } else if (isAISpeaking) {
        // Add effect from each active pulse wave
        for (const wave of pulseWavesRef.current) {
          const distance = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);
          const waveEffect = Math.sin(distance * 8 - wave.position * 2) * 
                           Math.exp(-wave.position * 0.5) * 
                           wave.strength * 0.05;
          radiusMultiplier += waveEffect;
        }
        
        const fastOsc = Math.sin(frame * 12 + Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2) * 4);
        const mediumOsc = Math.sin(frame * 8 + Math.sqrt(originalX ** 2 + originalZ ** 2) * 3);
        const slowOsc = Math.sin(frame * 4 + Math.sqrt(originalY ** 2 + originalZ ** 2) * 2);
        
        const combinedOsc = (fastOsc * 0.3 + mediumOsc * 0.5 + slowOsc * 0.2) * 0.2 + 0.1;
        const volumeResponse = combinedOsc * (volumeLevel/2) * 0.010;
        radiusMultiplier += volumeResponse;
        
        // Reset to base color
        const baseColor = new THREE.Color(0x4a90e2);
        colors[i] = baseColor.r;
        colors[i + 1] = baseColor.g;
        colors[i + 2] = baseColor.b;
      }

      positions[i] = originalX * radiusMultiplier;
      positions[i + 1] = originalY * radiusMultiplier;
      positions[i + 2] = originalZ * radiusMultiplier;
    }

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;

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
        <bufferAttribute
          attach="attributes-color"
          count={colorsRef.current ? colorsRef.current.length / 3 : 0}
          array={colorsRef.current || new Float32Array()}
          itemSize={3}
          needsUpdate={true}
          args={[new Float32Array(), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors={true}
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
