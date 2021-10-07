import React, { useState } from 'react';
import { Number3 } from '../types';

/**
 * HTML controls for binding 3D coordinates/rotation (for debugging/configuring)
 * Usage:
 * // Create some react state you store the configuration in:
 * const [position, setPosition] = useState<Number3>([0,0,0]);
 * const [rotation, setRotation] = useState<Number3>([0,0,0]);
 *
 *
 * // Then include some configurators in your DOM. If it's within the threejs's <Canvas> then you'll need <Html> to wrap it
 * //  otherwise, simply as a normal react component
 *
 * <Html className="configContainer">
 *     <Configurator name={"position"} onChange={r => setPosition(r)} min={-60} max={60} step={0.1} initial={[0, 0, 0]}/>
 *     <Configurator name={"rotation"} onChange={r => setRotation(r)} min={-Math.PI * 2} max={Math.PI * 2} step={0.01} initial={[0, 0, 0]}/>
 * </Html>
 *
 * // Then use the configurator's state in your model you're trying to position
 *
 * <Plane position={position} rotation={rotation} />
 */

export function Configurator(props: {
  onChange: (coords: Number3) => void;
  min: number;
  max: number;
  step: number;
  initial: Number3;
  name: string;
}) {
  const [xyz, setXYZ] = useState(props.initial);

  const setAndPublish = (coordinate: 'x' | 'y' | 'z') => (event: any) => {
    const newValue = parseFloat(event.target.value);
    const newArray: Number3 = {
      x: [newValue, xyz[1], xyz[2]] as Number3,
      y: [xyz[0], newValue, xyz[2]] as Number3,
      z: [xyz[0], xyz[1], newValue] as Number3,
    }[coordinate];

    setXYZ(newArray);
    props.onChange(newArray);
  };

  return (
    <div className="configFloater">
      <label>{props.name} &gt;&nbsp;</label>
      <label>x: {xyz[0]}</label>
      <input
        type="range"
        value={xyz[0]}
        min={props.min}
        max={props.max}
        step={props.step}
        onInput={setAndPublish('x')}
      />
      <label>y: {xyz[1]}</label>
      <input
        type="range"
        value={xyz[1]}
        min={props.min}
        max={props.max}
        step={props.step}
        onInput={setAndPublish('y')}
      />
      <label>z: {xyz[2]}</label>
      <input
        type="range"
        value={xyz[2]}
        min={props.min}
        max={props.max}
        step={props.step}
        onInput={setAndPublish('z')}
      />
    </div>
  );
}
