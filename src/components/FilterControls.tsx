import { useEffect, useState } from 'react';

import { prettyDate } from '../Utilities';

import { Dictionary, IAirport, IFlight } from '../types';

type FilterControlProps = {
  flights: IFlight[];
  airports: IAirport[];
  airportMap: Dictionary<IAirport>;
  simulationTime: number;
  maxFlightCount: number;
  selectedFlight: IFlight | null;
  setSelectedFlight: (flight: IFlight | null) => void;
  onFilteringChanged: (airports: IFlight[]) => void;
};

const isInFlightNow = (flight: IFlight, worldTime: number) => {
  const from = Number(flight.departureTime);
  const to = Number(flight.arrivalTime);
  return from < worldTime && worldTime < to;
};

export function FlightFilterControls({
  flights,
  airports,
  airportMap,
  onFilteringChanged,
  simulationTime,
  maxFlightCount,
  selectedFlight,
  setSelectedFlight,
}: FilterControlProps) {
  const [departureFilter, setDepartureFilter] = useState<string>('');
  const [arrivalFilter, setArrivalFilter] = useState<string>('');
  const [flightIdFilter, setFlightIdFilter] = useState<string>('');
  const [activeFlightFilter, setActiveFlightFilter] = useState<boolean>(true);

  const [filteredFlights, setFilteredFlights] = useState<IFlight[]>(flights);

  useEffect(() => {
    const filtered = flights.filter((flight) => {
      return (
        flight.departureAirportId.includes(departureFilter) &&
        flight.arrivalAirportId.includes(arrivalFilter) &&
        flight.id.includes(flightIdFilter) &&
        (!activeFlightFilter || isInFlightNow(flight, simulationTime))
      );
    });

    setFilteredFlights(filtered);
    onFilteringChanged(filtered);
  }, [departureFilter, arrivalFilter, flightIdFilter, activeFlightFilter, flights, onFilteringChanged, simulationTime]);

  return (
    <div className="flightFilterControls">
      <table>
        <thead className="flight-row-header">
          <tr>
            <td>Flight</td>
            <td>Departure time</td>
            <td>Departure airport</td>
            <td>Destination airport</td>
            <td>Expected arrival</td>
            <td>Visible</td>
          </tr>
        </thead>
        <thead>
          <tr>
            <td>
              <input type="text" value={flightIdFilter} onChange={(e) => setFlightIdFilter(e.target.value)} />
            </td>
            <td>
              <span>Is currently flying:</span>
              <input
                type="checkbox"
                checked={activeFlightFilter}
                onChange={(e) => setActiveFlightFilter(e.target.checked)}
              />
            </td>
            <td>
              <select onChange={(e) => setDepartureFilter(e.target.value)}>
                <option value="">ALL</option>
                {airports.map(({ id, city }) => (
                  <option key={id} value={id}>
                    [{id}]{city}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select onChange={(e) => setArrivalFilter(e.target.value)}>
                <option value="">ALL</option>
                {airports.map(({ id, city }) => (
                  <option key={id} value={id}>
                    [{id}]{city}
                  </option>
                ))}
              </select>
            </td>
            <td>Expected arrival</td>
          </tr>
        </thead>
        <tbody>
          {filteredFlights.map((flight, idx) => {
            const isSelected = flight.id === selectedFlight?.id;
            const classNames = [
              'flight-row',
              idx % 2 ? 'flight-row-even' : 'flight-row-odd',
              isSelected ? 'flight-row-selected' : '',
            ].join(' ');
            return (
              <tr key={flight.id} className={classNames} onClick={() => setSelectedFlight(flight)}>
                <td>{flight.id}</td>
                <td>{prettyDate(flight.departureTime)}</td>
                <td>{airportMap[flight.departureAirportId].city}</td>
                <td>{airportMap[flight.arrivalAirportId].city}</td>
                <td>{prettyDate(flight.arrivalTime)}</td>
                <td>{idx < maxFlightCount ? 'Yes✅' : 'No❌'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
