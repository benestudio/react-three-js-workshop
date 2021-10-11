import { OrbitControls } from '@react-three/drei';
import React from 'react';
import Globe from '../models/Globe';
import { Flight } from './Flight';
import Sun from './Sun';
import { Dictionary, IAirport, IFlight } from '../types';
import Airport from './Airport';
import { useFrame } from '@react-three/fiber';
import { getMinutes } from '../Utilities';

type FlightsSceneProps = {
  flightsList: IFlight[];
  airportsMap: Dictionary<IAirport>;
  airportsList: IAirport[];
  setSelectedFlight: (flight: IFlight) => void;
  selectedFlight: IFlight | null;
  simulationSpeed: number;
  onSimulationMinuteTick: (timestamp: number) => void;
};

export default function FlightsScene({
  flightsList,
  airportsMap,
  airportsList,
  setSelectedFlight,
  selectedFlight,
  simulationSpeed,
  onSimulationMinuteTick,
}: FlightsSceneProps) {
  useFrame((state, delta) => {
    const clock = state.clock as any;
    const worldTimeMs = clock.hackedWorldTime || Date.now();
    const worldTimeAfterTick = worldTimeMs + Math.floor(delta * 1000 * simulationSpeed);
    clock.hackedWorldTime = worldTimeAfterTick;

    if (getMinutes(worldTimeMs) !== getMinutes(worldTimeAfterTick)) {
      onSimulationMinuteTick(worldTimeAfterTick);
    }
    // There's currently no good way of propagating globally calculated information besides using unsafe javascript and piggybacking on global objects.
    // The alternatives are setState and contexts, but that's a really big performance hit.
  });

  return (
    <>
      <OrbitControls />
      <Sun />
      <Globe />
      {flightsList.map((flight) => {
        const from = airportsMap[flight.departureAirportId];
        const to = airportsMap[flight.arrivalAirportId];
        const selected = selectedFlight?.id === flight.id;
        return (
          <Flight
            key={flight.id}
            flight={flight}
            from={from}
            to={to}
            selected={selected}
            onFlightClicked={() => setSelectedFlight(flight)}
          />
        );
      })}
      {airportsList.map((airport) => {
        return <Airport key={airport.id} airport={airport} />;
      })}
    </>
  );
}
