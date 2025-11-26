import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Line, Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

// --- CONFIGURATION ---
const PALETTE = {
  glass: "#ffffff",
  dataBlue: "#00f0ff",
  successGold: "#ffaa00",
  bg: "#020205",
};

// --- COMPONENTS ---

// The "Pulse" representing the data flowing through the logic
const LogicPulse = ({ pathPoints, isFoggy }) => {
  const ref = useRef();
  const [targetIndex, setTargetIndex] = useState(1);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const target = pathPoints[targetIndex];
    // Fast decision when clear, slow/confused when foggy
    const speed = isFoggy ? 1.5 : 5;

    // Move towards target
    if (ref.current.position.distanceTo(target) < 0.1) {
      // Hit node, go next
      if (targetIndex < pathPoints.length - 1) {
        setTargetIndex((prev) => prev + 1);
      } else {
        // Reset to start
        ref.current.position.copy(pathPoints[0]);
        setTargetIndex(1);
      }
    }

    // Lerp movement
    ref.current.position.lerp(target, 0.1 * (delta * 10));
  });

  return (
    <mesh ref={ref} position={pathPoints[0]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshBasicMaterial
        color={isFoggy ? "#ff0000" : PALETTE.successGold}
        toneMapped={false}
      />
      <pointLight
        intensity={10}
        distance={5}
        color={isFoggy ? "#ff0000" : PALETTE.successGold}
      />
    </mesh>
  );
};

// The Decision Tree Structure
const DecisionStructure = ({ isFoggy }) => {
  // Hardcoded Logic Path (Root -> Left -> Right -> End)
  const nodes = useMemo(
    () => [
      new THREE.Vector3(0, 3, 0), // 0: Root
      new THREE.Vector3(-3, 0, 0), // 1: Node A
      new THREE.Vector3(3, 0, 0), // 2: Node B
      new THREE.Vector3(-5, -3, 0), // 3: Leaf A1
      new THREE.Vector3(-1, -3, 0), // 4: Leaf A2 (The Chosen Path)
      new THREE.Vector3(2, -3, 0), // 5: Leaf B1
      new THREE.Vector3(5, -3, 0), // 6: Leaf B2
    ],
    []
  );

  // The specific path the logic takes
  const logicPath = [nodes[0], nodes[1], nodes[4]];

  return (
    <group>
      {/* Draw Blue Connections (The Network) */}
      <Line
        points={[nodes[0], nodes[1]]}
        color={PALETTE.dataBlue}
        transparent
        opacity={0.3}
        lineWidth={1}
      />
      <Line
        points={[nodes[0], nodes[2]]}
        color={PALETTE.dataBlue}
        transparent
        opacity={0.3}
        lineWidth={1}
      />
      <Line
        points={[nodes[1], nodes[3]]}
        color={PALETTE.dataBlue}
        transparent
        opacity={0.3}
        lineWidth={1}
      />

      {/* THE GOLDEN PATH (Supervised Logic Trace) */}
      <Line
        points={[nodes[1], nodes[4]]}
        color={PALETTE.successGold}
        transparent
        opacity={isFoggy ? 0 : 1}
        lineWidth={4}
      />

      <Line
        points={[nodes[2], nodes[5]]}
        color={PALETTE.dataBlue}
        transparent
        opacity={0.3}
        lineWidth={1}
      />
      <Line
        points={[nodes[2], nodes[6]]}
        color={PALETTE.dataBlue}
        transparent
        opacity={0.3}
        lineWidth={1}
      />

      {/* Draw Glass Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhysicalMaterial
            color={isFoggy ? "#202020" : PALETTE.glass} // Dark when foggy, clear when supervised
            roughness={0}
            transmission={1}
            thickness={2}
            metalness={0.5}
            transparent={true}
            opacity={isFoggy ? 0.5 : 1}
          />
        </mesh>
      ))}

      {/* The Moving Pulse */}
      <LogicPulse pathPoints={logicPath} isFoggy={isFoggy} />
    </group>
  );
};

export default function App() {
  const [isFoggy, setFoggy] = useState(true);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#020205",
        position: "relative",
      }}
    >
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          intensity={200}
          color="#00f0ff"
        />
        <pointLight position={[-10, -10, -5]} intensity={50} color="#ff00aa" />

        {/* Content */}
        <Float rotationIntensity={0.2} floatIntensity={0.5}>
          <DecisionStructure isFoggy={isFoggy} />
        </Float>

        <Environment preset="city" />

        {/* Post Processing for the "Vibe" */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} intensity={1.5} radius={0.5} />
          <Noise opacity={0.1} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        {/* Volumetric Fog simulating the "Black Box" of LLMs */}
        {isFoggy && <fog attach="fog" args={["#020205", 5, 12]} />}

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>

      {/* UI Controls */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          fontFamily: "sans-serif",
          zIndex: 10,
          width: "100%",
        }}
      >
        <h2
          style={{
            color: isFoggy ? "#ff4444" : "#ffaa00",
            marginBottom: 15,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontSize: "1.2rem",
            textShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {isFoggy
            ? "Current State: LLM (Black Box)"
            : "Future State: Supervised ML (Transparent)"}
        </h2>

        <button
          onClick={() => setFoggy(!isFoggy)}
          style={{
            padding: "12px 30px",
            fontSize: "14px",
            background: isFoggy ? "rgba(255, 255, 255, 0.1)" : "#ffaa00",
            color: isFoggy ? "#fff" : "#000",
            border: isFoggy ? "1px solid #fff" : "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {isFoggy ? "Reveal Logic Trace" : "Reset Simulation"}
        </button>
      </div>
    </div>
  );
}
