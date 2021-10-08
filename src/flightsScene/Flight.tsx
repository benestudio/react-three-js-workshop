import { useRef } from 'react';
import { Group, Quaternion, Vector3 } from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';

import Airplane from '../models/Plane';
import { FLOAT_HEIGHT, GLOBE_SCALE, LEFT, MAP_TOP } from '../constants';
import { GLOBE_BASE_RADIUS } from '../models/Globe';

import { IAirport, IFlight } from '../types';
import { rotationQuaternionForCoordinates } from '../Utilities';
import { degToRad } from 'three/src/math/MathUtils';

type FlightProperties = {
  from: IAirport;
  to: IAirport;
  flightDescriptor: IFlight;
  onFlightClicked: (flight: IFlight, event: ThreeEvent<MouseEvent>) => void;
  selected: boolean;
};

export function Flight({ from, to }: { from: IAirport; to: IAirport }) {
  const rotationBoxRef = useRef<Group>();
  const flightContainerRef = useRef<Group>();

  useFrame((state, delta) => {
    const startQuaternion = rotationQuaternionForCoordinates(from.latitude, from.longitude);
    const endQuaternion = rotationQuaternionForCoordinates(to.latitude, to.longitude);

    if (rotationBoxRef.current && flightContainerRef.current) {
      const flightTime = 4;
      const phase = (state.clock.elapsedTime % flightTime) / flightTime;
      const worldPositionBefore = flightContainerRef.current.getWorldPosition(new Vector3());

      const rotationQuaternion = new Quaternion();
      rotationQuaternion.slerpQuaternions(startQuaternion, endQuaternion, phase);
      rotationBoxRef.current.setRotationFromQuaternion(rotationQuaternion);

      flightContainerRef.current.lookAt(worldPositionBefore);
      // .lookAt only sets x/y rotation, it screws up Z, but we can reset it
      if (from.latitude < to.latitude) {
        flightContainerRef.current.rotation.z = 0;
      } else {
        flightContainerRef.current.rotation.z = Math.PI;
      }
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
