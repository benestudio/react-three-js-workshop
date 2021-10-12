#!/usr/bin/env ts-node
import { generateFlights, generateAirports } from './generator';
import { mkdirSync } from 'fs';

console.log('generating flight data...');

let [daysSimulated, outputFolder] = process.argv.slice(2);

outputFolder = outputFolder || process.cwd();

mkdirSync(outputFolder);

generateFlights(parseInt(daysSimulated) || 10, outputFolder);
generateAirports(outputFolder);

console.log('data generated');
