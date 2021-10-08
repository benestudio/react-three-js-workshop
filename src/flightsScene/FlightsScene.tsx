import { OrbitControls } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import Globe from '../models/Globe';
import { Flight } from './Flight';
import Sun from './Sun';
import { Dictionary, IAirport, IFlight } from '../types';
import { indexBy } from 'ramda';
import { parseFlightDates } from '../Utilities';

export default function FlightsScene() {
  const [flightsList, setFlightsList] = useState<IFlight[]>([]);
  const [airportsMap, setAirportsMap] = useState<Dictionary<IAirport>>({});
  const [airportsList, setAirportList] = useState<IAirport[]>([]);

  useEffect(() => {
    fetch('/data/airports.json', {})
      .then((airportsResponse) => airportsResponse.json())
      .then((airportsJson: IAirport[]) => {
        const airportsMap = indexBy((e) => e.id, airportsJson);

        setAirportsMap(airportsMap);
        setAirportList(airportsJson);
      });
  }, []);

  useEffect(() => {
    fetch('/data/flights.json', {})
      .then((flightsResponse) => flightsResponse.json())
      .then((flightsJson) => flightsJson.map(parseFlightDates))
      .then((flightsJson: IFlight[]) => setFlightsList(flightsJson));
  }, []);

  const renderedFlights = flightsList.slice(0, 10);

  return (
    <>
      <OrbitControls />
      <Sun />
      <Globe />
      {renderedFlights.map((flight) => {
        const from = airportsMap[flight.departureAirportId];
        const to = airportsMap[flight.arrivalAirportId];
        return <Flight key={flight.id} from={from} to={to} />;
      })}
    </>
  );
}
