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
  const lastRadiusRef = useRef<Float32Array | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const lastSpeakingStateRef = useRef(isAISpeaking);

  React.useEffect(() => {
    if (isInitializedRef.current) return;

    const positions = [];
    const colors = [];
    const lastRadius = [];
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
      lastRadius.push(1, 1, 1);

      // Initialize with base color
      const baseColor = new THREE.Color(0x4a90e2);
      colors.push(baseColor.r, baseColor.g, baseColor.b);
    }

    const positionsArray = new Float32Array(positions);
    const colorsArray = new Float32Array(colors);
    const lastRadiusArray = new Float32Array(lastRadius);
    positionsRef.current = positionsArray;
    colorsRef.current = colorsArray;
    lastRadiusRef.current = lastRadiusArray;
    originalPositionsRef.current = positionsArray.slice();

    if (geometryRef.current) {
      geometryRef.current.setAttribute("position", new THREE.Float32BufferAttribute(positionsArray, 3));
      geometryRef.current.setAttribute("color", new THREE.Float32BufferAttribute(colorsArray, 3));
      geometryRef.current.computeBoundingSphere();
    }

    isInitializedRef.current = true;
  }, []);

  useFrame((state, delta) => {
    if (
      !pointsRef.current ||
      !positionsRef.current ||
      !originalPositionsRef.current ||
      !geometryRef.current ||
      !colorsRef.current ||
      !lastRadiusRef.current
    )
      return;

    frameRef.current += 0.01;
    const frame = frameRef.current;

    // Handle rotation based on speaking state changes
    if (!isAISpeaking) {
      // Update stored rotation when not speaking
      rotationRef.current.y += 0.0003; // Reduced from 0.001
      rotationRef.current.x += 0.0001; // Reduced from 0.0005
    }

    // Apply current rotation
    pointsRef.current.rotation.y = rotationRef.current.y;
    pointsRef.current.rotation.x = rotationRef.current.x;

    // Update last speaking state
    lastSpeakingStateRef.current = isAISpeaking;

    const positions = positionsRef.current;
    const originalPositions = originalPositionsRef.current;
    const colors = colorsRef.current;
    const lastRadius = lastRadiusRef.current;

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
    pulseWavesRef.current = pulseWavesRef.current.filter((wave) => {
      wave.position += 0.15;
      return wave.position < Math.PI;
    });

    // Update positions and colors
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i] || 0;
      const originalY = originalPositions[i + 1] || 0;
      const originalZ = originalPositions[i + 2] || 0;

      // Create a smoother base animation using multiple frequencies
      const distance = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);
      const slowWave = Math.sin(frame * 0.5 + distance * 2) * 0.003;
      const mediumWave = Math.sin(frame * 0.8 + distance * 3) * 0.002;

      // Always have a breathing effect
      const breathingAmplitude = isGettingReply ? 0.04 : 0.015; // More pronounced when getting reply
      const breathingFrequency = isGettingReply ? 1.2 : 0.7; // Faster breathing when getting reply
      const breathingEffect = Math.sin(frame * breathingFrequency) * breathingAmplitude;

      const baseOffset = slowWave + mediumWave + breathingEffect;
      let targetRadius = 1 + baseOffset;

      // Always apply shimmering colors effect
      const uniqueOffset = Math.sin(frame * 2 + i * 0.1);
      const colorIndex = Math.floor(((uniqueOffset + 1) / 2) * brandColors.length);
      const nextColorIndex = (colorIndex + 1) % brandColors.length;
      const lerpFactor = ((uniqueOffset + 1) / 2) * brandColors.length - colorIndex;

      const currentColor = brandColors[colorIndex] || brandColors[0] as THREE.Color;
      const nextColor = brandColors[nextColorIndex] || brandColors[0] as THREE.Color;

      // Interpolate between colors
      const finalColor = new THREE.Color().lerpColors(currentColor, nextColor, lerpFactor);

      colors[i] = finalColor.r;
      colors[i + 1] = finalColor.g;
      colors[i + 2] = finalColor.b;

      if (isGettingReply) {
        // Add more pronounced pulsing when getting reply
        const pulsePhase = Math.sin(frame * 1.5 + distance * 2);
        targetRadius += pulsePhase * 0.02;
      }

      if (isAISpeaking) {
        // Add effect from each active pulse wave with smoother transitions
        for (const wave of pulseWavesRef.current) {
          const waveEffect = Math.sin(distance * 6 - wave.position * 2) * Math.exp(-wave.position * 0.5) * wave.strength * 0.04;
          targetRadius += waveEffect;
        }

        // Smoother oscillation pattern for volume response
        const fastOsc = Math.sin(frame * 8 + distance * 3) * 0.3;
        const mediumOsc = Math.sin(frame * 5 + distance * 2) * 0.5;
        const slowOsc = Math.sin(frame * 3 + distance * 1.5) * 0.2;

        const combinedOsc = (fastOsc + mediumOsc + slowOsc) * 0.15 + 0.1;
        const volumeResponse = combinedOsc * (volumeLevel / 2) * 0.008;
        targetRadius += volumeResponse;

        // Add vibration effect when speaking, with intensity based on volume
        const vibrationIntensity = volumeLevel * 0.0002; // Dramatically reduced from 0.0008
        const vibrationSpeed = 6 + volumeLevel * 0.5; // Reduced from 8 + volumeLevel * 1
        const vibration = Math.sin(frame * vibrationSpeed + i * 0.1) * vibrationIntensity;
        targetRadius += vibration;
      }

      // Smooth interpolation between current and target radius
      const easing = 0.15; // Adjust this value to control smoothing (0-1)
      const currentRadius = lastRadius[i] || 1;
      const interpolatedRadius = currentRadius + (targetRadius - currentRadius) * easing;
      lastRadius[i] = interpolatedRadius;
      lastRadius[i + 1] = interpolatedRadius;
      lastRadius[i + 2] = interpolatedRadius;

      positions[i] = originalX * interpolatedRadius;
      positions[i + 1] = originalY * interpolatedRadius;
      positions[i + 2] = originalZ * interpolatedRadius;
    }

    if (geometryRef.current.attributes.position) {
      geometryRef.current.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometryRef.current.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geometryRef.current.attributes.position.needsUpdate = true;
      if (geometryRef.current.attributes.color) {
        geometryRef.current.attributes.color.needsUpdate = true;
      }
    }
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
      <pointsMaterial vertexColors={true} size={0.02} sizeAttenuation={true} transparent={true} opacity={0.8} />
    </points>
  );
}

export const WireframeSphere = ({ isAISpeaking, isGettingReply, volumeLevel, participantName }: WireframeSphereProps) => {
  return (
    <div style={{ width: "35vw", height: "35vw", opacity: isGettingReply ? 0.9 : 0.8 }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <Points isAISpeaking={isAISpeaking} isGettingReply={isGettingReply} volumeLevel={volumeLevel} />
      </Canvas>
    </div>
  );
};

export default WireframeSphere;
