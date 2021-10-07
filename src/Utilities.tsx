import React from 'react';
import { Quaternion, Vector3 } from 'three';
import { memoizeWith } from 'ramda';
import { LEFT, UP } from './constants';
import { degToRad } from 'three/src/math/MathUtils';

export function Box(
  props: React.PropsWithChildren<{
    position: [x: number, y: number, z: number];
    size?: [number, number, number];
    color?: string;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
  }>
) {
  return (
    <mesh {...props} scale={1}>
      <boxGeometry args={[props.size?.[0] || 1, props.size?.[1] || 1, props.size?.[2] || 1]} />
      <meshStandardMaterial opacity={1} color={props.color} />
    </mesh>
  );
}

export function quaternionToAlignVectors(v1: Vector3, v2: Vector3): Quaternion {
  const v1Norm = v1.clone().normalize();
  const v2Norm = v2.clone().normalize();
  const planeNormal = v1Norm.clone().cross(v2Norm).normalize();
  const rotationAngle = Math.acos(v1Norm.clone().dot(v2Norm));
  return new Quaternion().setFromAxisAngle(planeNormal, rotationAngle);
}

export function rotationQuaternionForCoordinates(lat: number, long: number): Quaternion {
  const q1 = new Quaternion().setFromAxisAngle(LEFT, degToRad(lat - 90)); //latitude
  const q2 = new Quaternion().setFromAxisAngle(UP, degToRad(long)); //longitude
  return q2.multiply(q1);
}

const padLeft0 = (n: number) => n.toString().padStart(2, '0');
export const prettyDate = memoizeWith(
  (e) => e.toISOString(),
  (date: Date) => {
    const month = padLeft0(date.getMonth() + 1);
    const day = padLeft0(date.getDate());
    const hours = padLeft0(date.getHours());
    const minutes = padLeft0(date.getMinutes());
    return `${month}/${day} ${hours}:${minutes}`;
  }
);

export const getMinutes = (timestamp: number) => Math.floor(timestamp / 60000);
