import React, { useRef, useState } from 'react';
import { Group, PointLight } from 'three';
import { Html } from '@react-three/drei';

import { GLOBE_SCALE } from '../constants';
import { GLOBE_BASE_RADIUS } from '../models/Globe';
import { Box, rotationQuaternionForCoordinates } from '../Utilities';

import { IAirport, Number3 } from '../types';
import { useFrame } from '@react-three/fiber';

const EARTH_SURFACE_ELEVATION = GLOBE_BASE_RADIUS * GLOBE_SCALE;

const LIGHT_POSITION: Number3 = [0, EARTH_SURFACE_ELEVATION + 0.04, 0];
const CITY_POSTION: Number3 = [0, EARTH_SURFACE_ELEVATION, 0];

export default function Airport(props: { airport: IAirport }) {
  const rotationBoxRef = useRef<Group>();
  const lightRef = useRef<PointLight>();
  const [hover, setHover] = useState<boolean>(false);
  const [r] = useState(Math.random());

  const rotationQuaternion = rotationQuaternionForCoordinates(props.airport.latitude, props.airport.longitude);

  useFrame((state, delta) => {
    if (lightRef.current) {
      const blinkPeriod = 3 + r;
      const phase = (state.clock.elapsedTime % blinkPeriod) / blinkPeriod;
      if (hover) {
        lightRef.current.intensity = 3;
      } else {
        lightRef.current.intensity = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
      }
    }
  });

  return (
    <group ref={rotationBoxRef} quaternion={rotationQuaternion}>
      {hover ? (
        <Html position-y={EARTH_SURFACE_ELEVATION}>
          <div className="info-bubble" onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <div>[{props.airport.city}]</div>
            <div>{props.airport.id} </div>
            <div>
              ({props.airport.latitude};{props.airport.longitude})
            </div>
            <a target={'_blank'} href={`https://en.wikipedia.org/wiki/${props.airport.city}`}>
              wikipedia
            </a>
          </div>
        </Html>
      ) : null}
      <Box
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        size={[0.05, 0.05, 0.05]}
        color={hover ? 'limegreen' : 'red'}
        position={CITY_POSTION}
      />
      <Sphere position={LIGHT_POSITION} baseColor={hover ? 'limegreen' : 'red'} />
      <pointLight ref={lightRef} color={hover ? 'limegreen' : 'red'} position={LIGHT_POSITION} />
    </group>
  );
}

function Sphere(
  props: React.PropsWithChildren<{ position: [x: number, y: number, z: number]; baseColor: string; reference?: any }>
) {
  return (
    <mesh {...props} ref={props.reference}>
      <sphereGeometry args={[0.01]} />
      <meshStandardMaterial color={props.baseColor} />
    </mesh>
  );
}
