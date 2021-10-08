import { OrbitControls } from '@react-three/drei';
import React from 'react';
import Globe from '../models/Globe';
import { Flight } from './Flight';
import Sun from './Sun';

export default function FlightsScene() {
  return (
    <>
      <OrbitControls />
      <Sun />
      <Globe />
      <Flight />
    </>
  );
}
