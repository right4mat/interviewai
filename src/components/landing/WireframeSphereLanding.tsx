"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { brand } from "@/theme/themePrimitives";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Button } from "@mui/material";

interface WireframeSphereProps {
  participantName: string;
  isAISpeaking: boolean;
  isGettingReply: boolean;
  volumeLevel: number;
  isExcited?: boolean;
  isStartingInterview?: boolean;
  onHover?: (isHovering: boolean) => void;
  onClick?: () => void;
}

// Convert brand colors to THREE.Color array for shimmering
const brandColors = [
  new THREE.Color(brand[200]),
  new THREE.Color(brand[300]),
  new THREE.Color(brand[400]),
  new THREE.Color(brand[500]),
  new THREE.Color(brand[600])
];

function Points({
  isAISpeaking,
  isGettingReply,
  volumeLevel,
  isExcited,
  isStartingInterview
}: Omit<WireframeSphereProps, "participantName" | "onHover" | "onClick">) {
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
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const interviewStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      targetRotationRef.current = { x: y * Math.PI * 0.15, y: x * Math.PI * 0.15 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

    // Handle interview start animation
    if (isStartingInterview) {
      if (interviewStartTimeRef.current === null) {
        interviewStartTimeRef.current = frame;
      }
      const elapsedTime = frame - interviewStartTimeRef.current;
      if (elapsedTime < 1.5) {
        pointsRef.current.scale.set(1 + elapsedTime / 1.5, 1 + elapsedTime / 1.5, 1 + elapsedTime / 1.5);
      } else if (elapsedTime < 2.0) {
        const shrinkFactor = 1 - ((elapsedTime - 1.5) / 0.5) * (1 / 3);
        pointsRef.current.scale.set(shrinkFactor, shrinkFactor, shrinkFactor);
      } else {
        pointsRef.current.scale.set(2 / 3, 2 / 3, 2 / 3);
        interviewStartTimeRef.current = null; // Reset after animation
      }
    }

    // Apply cursor-based rotation with elastic effect
    const { x: targetX, y: targetY } = targetRotationRef.current;
    const currentX = pointsRef.current.rotation.x;
    const currentY = pointsRef.current.rotation.y;
    const elasticity = 0.015; // Lower value for slower, heavier movement

    pointsRef.current.rotation.x += (targetX - currentX) * elasticity;
    pointsRef.current.rotation.y += (targetY - currentY) * elasticity;

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
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      // Create a smoother base animation using multiple frequencies
      const distance = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);
      const slowWave = Math.sin(frame * 0.5 + distance * 2) * 0.003;
      const mediumWave = Math.sin(frame * 0.8 + distance * 3) * 0.002;
      const baseOffset = slowWave + mediumWave;

      let targetRadius = 1 + baseOffset;

      if (isGettingReply) {
        // Smooth pulsing effect synchronized with color changes
        const uniqueOffset = Math.sin(frame * 2 + i * 0.1);
        const pulsePhase = Math.sin(frame * 1.5 + distance * 2);
        targetRadius += pulsePhase * 0.02;

        // Create unique shimmering pattern for each point
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

        // Reset to base color
        const baseColor = new THREE.Color(0x4a90e2);
        colors[i] = baseColor.r;
        colors[i + 1] = baseColor.g;
        colors[i + 2] = baseColor.b;
      }

      // Add excited vibration effect
      if (isExcited) {
        const vibration = Math.sin(frame * 20 + i * 0.1) * 0.01;
        targetRadius += vibration;
      }

      // Smooth interpolation between current and target radius
      const easing = 0.15; // Adjust this value to control smoothing (0-1)
      const currentRadius = lastRadius[i];
      const interpolatedRadius = currentRadius + (targetRadius - currentRadius) * easing;
      lastRadius[i] = interpolatedRadius;
      lastRadius[i + 1] = interpolatedRadius;
      lastRadius[i + 2] = interpolatedRadius;

      positions[i] = originalX * interpolatedRadius;
      positions[i + 1] = originalY * interpolatedRadius;
      positions[i + 2] = originalZ * interpolatedRadius;
    }

    geometryRef.current.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometryRef.current.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
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

export const WireframeSphere = ({
  isAISpeaking,
  isGettingReply,
  volumeLevel,
  participantName,
  isExcited,
  isStartingInterview,
  onHover,
  onClick
}: WireframeSphereProps) => {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [buttonNoOpacity, setButtonNoOpacity] = useState(false);
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!sphereRef.current) return;
      const rect = sphereRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      setShowPlayButton(distance < rect.width / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={sphereRef} style={{ position: "relative", width: "35vw", height: "35vw" }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", zIndex: -1 }}
      >
        <Points
          isAISpeaking={isAISpeaking}
          isGettingReply={isGettingReply}
          volumeLevel={volumeLevel}
          isExcited={isExcited}
          isStartingInterview={isStartingInterview}
        />
      </Canvas>

      <Button
        variant="contained"
        color="primary"
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto", // Changed from "none" to "auto" to enable hover events
          width: "5rem",
          height: "5rem",
          borderRadius: "50%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: showPlayButton ? 0.5 : 0,
          transition: "opacity 0.3s",
          "&:hover": {
            opacity: 1
          }
        }}
        onMouseEnter={() => {
          onHover?.(true);
        }}
        onMouseLeave={() => {
          onHover?.(false);
        }}
        onClick={onClick}
      >
        <PlayArrowIcon style={{ fontSize: "4rem", color: "white" }} />
      </Button>
    </div>
  );
};

export default WireframeSphere;
