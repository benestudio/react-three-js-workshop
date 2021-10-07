export interface IFlight {
  id: string;
  departureAirportId: string;
  arrivalAirportId: string;
  seats: number;
  passengers: number;
  seatUtilizationPercentage: number;
  flightTimeMinutes: number;
  departureTime: Date;
  arrivalTime: Date;
}

export interface IAirport {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
}

export type Dictionary<T> = {
  [key: string]: T;
};

export type Number3 = [number, number, number];
export type Number2 = [number, number];