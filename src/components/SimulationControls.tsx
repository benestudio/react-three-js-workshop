import { ChangeEvent, useState } from 'react';

export function SimulationSpeedControl({ onSimulationSpeedChange }: { onSimulationSpeedChange: (s: number) => void }) {
  const [speed, setSpeed] = useState<number>(1);

  const updateAndPublish = (event: ChangeEvent<HTMLInputElement>) => {
    const spd = event.target.value as any;
    setSpeed(spd);
    onSimulationSpeedChange(10 ** spd);
  };

  return (
    <div>
      <div>
        Speed: {speed}x | (1 minute = 10^{speed} (={10 ** speed}) simulation minutes)
      </div>
      <input type="range" min={0} max={4} step={1} value={speed} onChange={updateAndPublish} />
    </div>
  );
}

export function SimulationSizeControl({ onMaxFlightCountChange }: { onMaxFlightCountChange: (s: number) => void }) {
  const [flightCount, setFlightCount] = useState<number>(10);

  const updateAndPublish = (event: ChangeEvent<HTMLInputElement>) => {
    const count = event.target.value as any;
    setFlightCount(count);
    onMaxFlightCountChange(count);
  };

  return (
    <div>
      <div>Max rendered flights: {flightCount}</div>
      <input type="range" min={1} max={500} step={1} value={flightCount} onChange={updateAndPublish} />
    </div>
  );
}
