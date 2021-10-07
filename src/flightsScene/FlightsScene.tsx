import {OrbitControls} from "@react-three/drei";
import React, {useRef} from "react";
import {PointLight} from "three";
import {useFrame} from "@react-three/fiber";
import Globe from "../models/Globe";
import Plane from "../models/Plane";
import {MAP_TOP, PLANE_SCALE} from "../constants";

export default function FlightsScene() {
  const lightRef = useRef<PointLight>();

  useFrame((state, delta) => {
    const phase = (state.clock.elapsedTime % 3) / 3;
    const phaseRadians = Math.PI * 2 * phase;

    if (lightRef.current) {
      const x = Math.sin(phaseRadians) * 10;
      const z = Math.cos(phaseRadians) * 10;
      lightRef.current.position.set(x, 0, z);
    }
  });

  return (
    <>
      <OrbitControls/>
      <pointLight ref={lightRef} intensity={5.0} position={[2, 2, 2]}/>
      <Globe/>
      <Plane scale={PLANE_SCALE} />
    </>
  )
}
