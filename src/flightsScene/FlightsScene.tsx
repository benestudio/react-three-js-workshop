import { OrbitControls } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import Globe from '../models/Globe';
import { Flight } from './Flight';
import Sun from './Sun';
import { IAirport } from '../types';

export default function FlightsScene() {
  const [airports, setAirports] = useState<IAirport[]>([]);

  useEffect(() => {
    fetch('/data/airports.json')
      .then((e) => e.json())
      .then((airports) => setAirports(airports));
  }, []);

  const budapest = airports.find((e) => e.id === 'BUD');
  const sydney = airports.find((e) => e.id === 'SYD');

  return (
    <>
      <OrbitControls />
      <Sun />
      <Globe />
      {airports.length ? (
        <>
          <Flight from={budapest!} to={sydney!} />
          <Flight from={sydney!} to={budapest!} />
        </>
      ) : null}
    </>
  );
}
