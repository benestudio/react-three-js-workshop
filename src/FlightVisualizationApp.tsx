import './App.css';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FlightsScene from './flightsScene/FlightsScene';
import { Dictionary, IAirport, IFlight } from './types';
import { indexBy } from 'ramda';
import { parseFlightDates, prettyDate } from './Utilities';
import { FlightFilterControls } from './components/FilterControls';
import { SimulationSizeControl } from './components/SimulationControls';

const date = Date.now();

function FlightVisualizationApp() {
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

  const [selectedFlight, setSelectedFlight] = useState<IFlight | null>(null);
  const [filteredFlights, setFilteredFlights] = useState<IFlight[]>([]);
  const [maxFlightCount, setMaxFlightCount] = useState(20);

  return (
    <div className="App">
      <aside className="controlPanel">
        <div className="input-controls">
          <div>Current date: {prettyDate(new Date(date))}</div>
          <SimulationSizeControl onMaxFlightCountChange={setMaxFlightCount} />
        </div>
        <hr />
        <FlightFilterControls
          flights={flightsList}
          airports={airportsList}
          airportMap={airportsMap}
          maxFlightCount={maxFlightCount}
          simulationTime={date}
          selectedFlight={selectedFlight}
          setSelectedFlight={setSelectedFlight}
          onFilteringChanged={setFilteredFlights}
        />
      </aside>
      <React.Suspense fallback={<div>Loading data...ð</div>}>
        <Canvas id="canvas">
          <FlightsScene
            flightsList={filteredFlights}
            airportsList={airportsList}
            airportsMap={airportsMap}
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
          />
        </Canvas>
      </React.Suspense>
    </div>
  );
}

export default FlightVisualizationApp;
