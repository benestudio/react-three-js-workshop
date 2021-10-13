import { Vector3 } from 'three';

import { Number3 } from './types';

export const LEFT = new Vector3(-1, 0, 0);
export const UP = new Vector3(0, 1, 0);
export const RIGHT = new Vector3(1, 0, 0);

export const GLOBE_SCALE = 1 / 20;
export const GLOBE_BASE_RADIUS = 42;
export const FLOAT_HEIGHT = 1 / 20;

export const PLANE_SCALE = 1 / 300;

export const EARTH_SURFACE_HEIGHT = GLOBE_BASE_RADIUS * GLOBE_SCALE;
export const MAP_TOP: Number3 = [0, EARTH_SURFACE_HEIGHT + FLOAT_HEIGHT, 0];

export const PLANE_ROOT_NODE_ROTATION: Number3 = [0, 3.14, 2.77];
export const PLANE_ROOT_NODE_POSITION: Number3 = [10.3, -24.2, 6.4];
