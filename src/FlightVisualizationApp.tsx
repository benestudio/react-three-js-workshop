import './App.css';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import FlightsScene from './flightsScene/FlightsScene';

function FlightVisualizationApp() {
  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading data...ð</div>}>
        <Canvas id="canvas">
          <FlightsScene />
        </Canvas>
      </React.Suspense>
    </div>
  );
}

export default FlightVisualizationApp;
