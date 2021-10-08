import React, { useRef } from 'react';
import { PointLight } from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '../Utilities';

export default function Sun() {
  const ref = useRef<PointLight>();

  useFrame((state, delta) => {
    const phase = (state.clock.elapsedTime % 30) / 30;
    const phaseRadians = Math.PI * 2 * phase;

    if (ref.current) {
      const x = Math.sin(phaseRadians) * 10;
      const z = Math.cos(phaseRadians) * 10;
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
