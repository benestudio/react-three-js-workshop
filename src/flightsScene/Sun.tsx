import React, { useRef } from 'react';
import { PointLight } from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '../Utilities';

const ORBIT_PERIOD_24H = 24 * 60 * 60 * 1000;
const ORBIT_DISTANCE = 10;
export default function Sun() {
  const ref = useRef<PointLight>();

  useFrame((state, delta) => {
    const time = (state.clock as any).hackedWorldTime;
    const phase = (time % ORBIT_PERIOD_24H) / ORBIT_PERIOD_24H;
    const phaseRadians = Math.PI * 2 * phase + Math.PI;

    if (ref.current) {
      const x = Math.sin(phaseRadians) * ORBIT_DISTANCE;
      const z = Math.cos(phaseRadians) * ORBIT_DISTANCE;
      ref.current.position.set(x, 0, z);
    }
  });

  return (
    <group ref={ref}>
      <Sphere color={'yellow'} isEmissive={true} />
      <pointLight intensity={5.0} />
    </group>
  );
}
