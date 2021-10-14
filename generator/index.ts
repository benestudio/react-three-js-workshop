#!/usr/bin/env ts-node
import { generateFlights, generateAirports } from './generator';
import { mkdirSync, existsSync } from 'fs';

console.log('generating flight data...');

let [daysSimulated, outputFolder] = process.argv.slice(2);

outputFolder = outputFolder || process.cwd();

if(!existsSync(outputFolder)){
    mkdirSync(outputFolder);
}

generateFlights(parseInt(daysSimulated) || 10, outputFolder);
generateAirports(outputFolder);

console.log('data generated');
