// src/pages/LandingPage.tsx

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, useTexture } from "@react-three/drei";

// ✅ Tafelcomponent
function TableModel() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Table.glb");

  const [
    map,
    normalMap,
    aoMap,
    roughnessMap,
    metalnessMap,
  ] = useTexture([
    "/textures/work_bench_Albedo.png",
    "/textures/work_bench_Normal.png",
    "/textures/work_bench_AO.png",
    "/textures/work_bench_Roughness.png",
    "/textures/work_bench_Metallic.png",
  ]);

  useEffect(() => {
    if (ref.current) {
      ref.current.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            map,
            normalMap,
            aoMap,
            roughnessMap,
            metalnessMap,
          });
        }
      });
    }
  }, [map, normalMap, aoMap, roughnessMap, metalnessMap]);

  // Inzoom-effect
  useFrame(() => {
    if (ref.current) {
      const s = ref.current.scale;
      if (s.x < 1.2) {
        s.x += 0.005;
        s.y += 0.005;
        s.z += 0.005;
      }
    }
  });

  return (
    <primitive object={scene} ref={ref} scale={0.6} position={[0, 0, 0]} />
  );
}

// ✅ Camera beweegt naar voorzijde tafel
function CameraGlide() {
  const { camera } = useThree();
  const [done, setDone] = useState(false);

  useFrame(() => {
    if (done) return;

    const target = new THREE.Vector3(20, 150, 170); // bijna gelijk aan jouw versie
    const lookAtPos = new THREE.Vector3(0, 1.2, 0); // iets hoger op het tafelblad gericht

    camera.lookAt(lookAtPos);
    camera.position.lerp(target, 0.02);

    if (camera.position.distanceTo(target) < 0.05) {
      camera.position.copy(target);
      setDone(true);
    }
  });

  return null;
}

// ✅ LandingPage
export const LandingPage: React.FC = () => {
  return (
    <div className="h-screen bg-[#1e1b18] relative overflow-hidden">
      <Canvas camera={{ position: [30, 10, 100], fov: 45 }} style={{ background: "#1e1b18" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[30, 30, 30]} intensity={1.5} />
        <Environment preset="sunset" />
        <OrbitControls enabled={true} />
        <CameraGlide />
        <TableModel />
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
    </div>
  );
};
