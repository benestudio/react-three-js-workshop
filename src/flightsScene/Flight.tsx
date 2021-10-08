import { useRef } from 'react';
import { Group, Quaternion } from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';

import Airplane from '../models/Plane';
import { FLOAT_HEIGHT, GLOBE_SCALE, LEFT } from '../constants';
import { GLOBE_BASE_RADIUS } from '../models/Globe';

import { IAirport, IFlight } from '../types';

type FlightProperties = {
  from: IAirport;
  to: IAirport;
  flightDescriptor: IFlight;
  onFlightClicked: (flight: IFlight, event: ThreeEvent<MouseEvent>) => void;
  selected: boolean;
};

export function Flight() {
  const rotationBoxRef = useRef<Group>();
  const flightContainerRef = useRef<Group>();

  useFrame((state, delta) => {
    const startQuaternion = new Quaternion().setFromAxisAngle(LEFT, 0);
    const midQuaternion = new Quaternion().setFromAxisAngle(LEFT, Math.PI);
    const endQuaternion = new Quaternion().setFromAxisAngle(LEFT, Math.PI * 2);
    if (rotationBoxRef.current) {
      const phase = (state.clock.elapsedTime % 3) / 3;

      const rotationQuaternion = new Quaternion();
      if (phase < 0.5) {
        rotationQuaternion.slerpQuaternions(startQuaternion, midQuaternion, phase * 2);
      } else {
        rotationQuaternion.slerpQuaternions(midQuaternion, endQuaternion, (phase - 0.5) * 2);
      }

      rotationBoxRef.current.setRotationFromQuaternion(rotationQuaternion);
    }
  });

  return (
    <group ref={rotationBoxRef}>
      <group ref={flightContainerRef} position-y={GLOBE_BASE_RADIUS * GLOBE_SCALE + FLOAT_HEIGHT}>
        {/* ^ This box is a convenience because it's hard to forward ref to inside the airplane */}
        <Airplane />
      </group>
    </group>
  );
}
