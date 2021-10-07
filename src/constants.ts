import { Vector3 } from 'three';
import { Number3 } from './types';
// import { GLOBE_BASE_RADIUS } from './models/Globe';

export const LEFT = new Vector3(-1, 0, 0);
export const UP = new Vector3(0, 1, 0);

export const GLOBE_SCALE = 1 / 20;
export const FLOAT_HEIGHT = 1 / 20;

export const PLANE_SCALE = 1 / 500;

// export const EARTH_SURFACE_HEIGHT = GLOBE_BASE_RADIUS * GLOBE_SCALE;
// export const MAP_TOP: Number3 = [0, EARTH_SURFACE_HEIGHT + FLOAT_HEIGHT, 0];

export const PLANE_ROOT_NODE_ROTATION = [0, 3.14, 2.77];
export const PLANE_ROOT_NODE_POSITION = [10.3, -24.2, 6.4];
