import fs from 'fs';
import path from 'path';
import { airports } from './airports';
import { IAirport, IFlight } from '../src/types';

const airportIds = airports.map((a) => a.id);

const currentDate = Date.now();
const minutes = 60 * 1000;
const fiveMinutes = 5 * minutes;
const hours = 60 * minutes;

export const generateFlights = (daysSimulated: number, outputFolder: string) => {
  const flights = [];

  for (let i = 0; i < daysSimulated * 288; i++) {
    flights.push(generateFlight(i));
  }

  const flightsAsJson = JSON.stringify(flights, null, 2);

  const outputPath = path.join(outputFolder, 'flights.json');
  fs.writeFile(outputPath, flightsAsJson, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('flights data generated successfully');
    }
  });
};

export const generateAirports = (outputFolder: string) => {
  const airportStats: IAirport[] = airports;

  const airportStatsAsJSON = JSON.stringify(airportStats, null, 2);

  const outputPath = path.join(outputFolder, 'airports.json');
  fs.writeFile(outputPath, airportStatsAsJSON, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('airport data generated successfully');
    }
  });
};

const generateFlight = (index: number): IFlight => {
  const [fromAirport, toAirport] = getFlightDestinationPair();
  const flightTime = calculateFlightTime(fromAirport, toAirport);

  const numberOfSeats = randBetween(100, 250);
  const numberOfPassengers = randBetween(50, numberOfSeats);
  const seatUtilizationPercentage = Math.trunc((numberOfPassengers / numberOfSeats) * 100);
  const departureTime = roundTo(currentDate + index * fiveMinutes, fiveMinutes);
  const arrivalTime = departureTime + flightTime;

  return {
    id: randBetween(10e6, 20e7).toString(36).toUpperCase(),
    departureAirportId: fromAirport.id,
    arrivalAirportId: toAirport.id,
    seats: numberOfSeats,
    passengers: numberOfPassengers,
    seatUtilizationPercentage,
    departureTime: new Date(departureTime),
    arrivalTime: new Date(arrivalTime),
    flightTimeMinutes: Math.floor(flightTime / minutes),
  };
};

const getFlightDestinationPair = (): [IAirport, IAirport] => {
  const fromOrdinal = randBetween(0, airportIds.length);
  const jump = randBetween(1, airportIds.length);
  const toOrdinal = (fromOrdinal + jump) % airportIds.length;

  return [airports[fromOrdinal], airports[toOrdinal]];
};

const calculateFlightTime = (airport1: IAirport, airport2: IAirport) => {
  const distance = distanceBetween(airport1, airport2);

  const timeForTakeoffAndLanding = 30 * minutes;
  const avgFlightSpeed = 800; // km/h
  const totalFlightTime = timeForTakeoffAndLanding + (distance / avgFlightSpeed) * hours;

  return roundTo(totalFlightTime, 5 * minutes);
};

const randBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const toRad = (deg: number) => (deg / 180) * Math.PI;

const distanceBetween = (airport1: IAirport, airport2: IAirport) => {
  const phi1 = toRad(airport1.latitude);
  const phi2 = toRad(airport2.latitude);
  const lambda1 = toRad(airport1.longitude);
  const lambda2 = toRad(airport2.longitude);

  const radius = 6371; //km

  const { sin, cos, sqrt, asin } = Math;

  const sinoidalAvg = (a: number, b: number) => sin(sin(Math.abs(a - b) / 2));

  const haversineFactor = sinoidalAvg(phi2, phi1) + cos(phi1) * cos(phi2) * sinoidalAvg(lambda2, lambda1);
  const haversineRounded = Math.min(1, haversineFactor);
  const distance = 2 * radius * asin(sqrt(haversineRounded));

  if (!distance) {
    console.log(`Error generating data for ${airport1.id} -> ${airport2.id}`, {
      phi1,
      phi2,
      lambda1,
      lambda2,
      haversineFactor,
      distance,
    });
  }
  return distance;
};

const roundTo = (n: number, accuracy: number) => {
  return Math.round(n / accuracy) * accuracy;
};
