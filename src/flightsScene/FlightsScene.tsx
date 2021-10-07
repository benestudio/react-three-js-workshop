import {OrbitControls} from "@react-three/drei";
import {Box} from "../Utilities";
import React, {useEffect, useRef, useState} from "react";
import {PointLight} from "three";
import {useFrame} from "@react-three/fiber";

export default function FlightsScene() {
  const [intensity, setIntensity] = useState(1.0);
  const lightRef = useRef<PointLight>();

  useEffect(() => {
    setInterval(() => {
      setIntensity(Math.random() * 3.0);
    }, 1000);
  }, []);

  useFrame((state, delta) => {
    const phase = (state.clock.elapsedTime % 3) / 3;
    const phaseRadians = Math.PI * 2 * phase;

    if (lightRef.current) {
      const x = Math.sin(phaseRadians) * 2;
      const y = Math.cos(phaseRadians) * 2;
      lightRef.current.position.set(x, y, x*y);
    }
  });

  return (
    <>
      <OrbitControls/>
      <pointLight ref={lightRef} intensity={intensity} position={[2, 2, 2]}/>
      <Box position={[0, 0, 0]} color={'yellow'}/>
    </>
  )
}
