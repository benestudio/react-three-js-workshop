import { OrbitControls } from '@react-three/drei';
import React from 'react';
import Globe from '../models/Globe';
import { Flight } from './Flight';
import Sun from './Sun';
import { Dictionary, IAirport, IFlight } from '../types';
import Airport from './Airport';

type FlightsSceneProps = {
  flightsList: IFlight[];
  airportsMap: Dictionary<IAirport>;
  airportsList: IAirport[];
  setSelectedFlight: (flight: IFlight) => void;
  selectedFlight: IFlight | null;
};

export default function FlightsScene({
  flightsList,
  airportsMap,
  airportsList,
  setSelectedFlight,
  selectedFlight,
}: FlightsSceneProps) {
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
