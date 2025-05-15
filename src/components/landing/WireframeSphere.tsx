"use client";
import * as React from 'react';
import * as THREE from 'three';


export const WireframeSphere = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = React.useRef<number>(0);
  const pointsRef = React.useRef<THREE.Points | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const positionsRef = React.useRef<Float32Array | null>(null);
  const originalPositionsRef = React.useRef<Float32Array | null>(null);
  const targetPositionsRef = React.useRef<Float32Array | null>(null);

  const cleanup = React.useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    if (rendererRef.current && containerRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.dispose();
      if (pointsRef.current.material instanceof THREE.Material) {
        pointsRef.current.material.dispose();
      }
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
    }

    sceneRef.current = null;
    rendererRef.current = null;
    pointsRef.current = null;
    cameraRef.current = null;
    positionsRef.current = null;
    originalPositionsRef.current = null;
    targetPositionsRef.current = null;
  }, []);
  
  React.useEffect(() => {
    if (!containerRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create points for sphere
    const positions = [];
    const vertices = 2000;

    for (let i = 0; i < vertices; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 1;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    const positionsArray = new Float32Array(positions);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
    
    // Store original positions for reference
    positionsRef.current = geometry.attributes.position.array as Float32Array;
    originalPositionsRef.current = positionsArray.slice();
    targetPositionsRef.current = new Float32Array(positionsArray.length);

    const material = new THREE.PointsMaterial({
      color: 0x4a90e2,
      size: 0.02,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);
    
    camera.position.z = 2;

    // Animation
    let frame = 0;
    let lastUpdateTime = 0;
    const transitionDuration = 200; // Duration of transition in ms
    let transitionStartTime = 0;
    
    const animate = (currentTime: number) => {
      if (!pointsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current || !positionsRef.current || !originalPositionsRef.current || !targetPositionsRef.current) {
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
      frame += 0.002;
      
      // Update target positions every 200ms
      if (currentTime - lastUpdateTime > (200 + Math.random() * 300)) {
        const originalPositions = originalPositionsRef.current;
        const targetPositions = targetPositionsRef.current;
        
        for (let i = 0; i < originalPositions.length; i += 3) {
          const originalX = originalPositions[i];
          const originalY = originalPositions[i + 1];
          const originalZ = originalPositions[i + 2];
          
          // Calculate original radius
          const radius = Math.sqrt(originalX * originalX + originalY * originalY + originalZ * originalZ);
          
          // Add random variation to radius (-0.2 to 0.2)
          const radiusVariation = 1 + (Math.random() * 0.1 - 0.2);
          
          targetPositions[i] = originalX * radiusVariation;
          targetPositions[i + 1] = originalY * radiusVariation;
          targetPositions[i + 2] = originalZ * radiusVariation;
        }
        
        lastUpdateTime = currentTime;
        transitionStartTime = currentTime;
      }

      // Animate positions
      const positions = positionsRef.current;
      const targetPositions = targetPositionsRef.current;
      const progress = Math.min((currentTime - transitionStartTime) / transitionDuration, 1);
      
      for (let i = 0; i < positions.length; i++) {
        positions[i] += (targetPositions[i] - positions[i]) * progress;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      pointsRef.current.rotation.y = frame;
      pointsRef.current.rotation.x = frame * 0.5;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [cleanup]);

  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return <div ref={containerRef} style={{ width: '35vw', height: '35vw' }} />;
};

export default WireframeSphere;