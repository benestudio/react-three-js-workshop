# React + Three.js workshop using @react-three (prezi / bene:studio) 

This document contains some directions and context around the workshop material.

## Requirements
**Tools:**
 - `node.js` (https://nodejs.org) (12+, ideally 14+)
 - `yarn` (https://yarnpkg.com/ - or `npm install -g yarn`)
 - IDE of choice (VS code or IntelliJ Idea recommended)

**Knowledge:**
 - javascript (intermediate)
 - react (basic / intermediate)
   - hooks, function components, context
   - fibers
 - typescript (basic)
 - 3D (basic)
   - models
   - meshes
   - 3D vector maths

## Workshop purpose
- Demonstrate building applications that use 3D rendering through a react-ish interface.
- The end-product we're going to build is an app that visualizes some flight data (generated, but may as well fetch real data).

_Disclaimer: We know that the universe is not geocentric, but for our purposes and visibility, this is easier to depict._

You can see the final product here: https://delanni.github.io/react-three-flight-visualization/

## Operational details


## Steps to build a basic flight visualization app
Note: This guide doesn't contain all the required code changes.
You might need to improvise/bridge between steps, I am not detailing every change, however this git repository contains the incremental changes in different commits!

### Step 0 - Preparations done by us
- Set up the skeleton of the project with `create-react-app`
- Set up some tooling (`prettier`)
- Download & add models (from https://sketchfab.com)
- Data generators ([/generator](/generator))
- Provide some components, utilities, and constants that are useful, but not meant to be the core material of the workshop.

⚠️ Remember: if your code starts to look ugly: run `yarn prettify`

---

### Step 1 - @react-three Hello-world

Run `yarn` to install the dependencies.

Add dependencies to the libraries we'd be using:
- [three](https://www.npmjs.com/package/three) (& @types/three) - The 3D library these are all built on
- [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber) - The bridge that manages the three <-> react interface
- [@react-three/drei](https://www.npmjs.com/package/@react-three/drei) - Some utilities that help working with the above
- [gltfjsx](https://www.npmjs.com/package/@react-three/drei) - A utility to help build JSX interface for GLTF models

```shell
yarn add @react-three/drei @react-three/fiber three
yarn add -D @types/three gltfjsx
``` 

Now you can start the app with:
`yarn start`

You'll see a white screen. **Success!**

In the `FlightVisualizationApp`, you can set up few a basic objects to see the app is actually working:
```typescript jsx
  // We can use some of the utilities we prepared.
  <Canvas>
    <ambientLight intensity={1.0} /> {/* <pointLight intensity={2.5} position={[2,2,2]} />  */}
    <OrbitControls/>
    <Box position={[0,0,0]} />
  </Canvas>
```

This is all right, we can now see and interact the world.
You can play around with some of the parameters, to see how the world reacts.

Animating properties of 3D objects is an important part of the workshop, let's see what are our options.

Talk about `phase` calculation and a bit of 3D vector maths:
- Phases help reduce a problem to a 0 -> 1 state transition. Then we map out the values from 0->1 to the periods/phases of an animation.
- 3D vector maths: XYZ, right hand rule, grouping and transformations.

- Let's animate the intenstiy of the light with a `setInterval` + `setState`;
- Let's animate the position of the light with `useFrame`;

Poof! Hooks can only be used within the react-three context.
-> Let's create a scene: `FlightsScene.tsx` - it's a good division between the magical 3d world and the react we know and love

Now we have a blinking strobe light flying around a box.

---

### Step 2 - Bring in the models!

Talk about:
- meshes
- materials
- models

Mention sketchfab.com.

Models downloaded an unzipped to `/public/models/`.
It's because our webserver hosts these files, and they're accessible from the browser that'd
like to load the models/materials based on urls.

More notes in: [this doc](/public/importing-a-new-model.md)

Let's generate model wrappers with `gltfjsx`:
```shell
npx gltfjsx public/models/plane/plane.gltf -t -k -m
npx gltfjsx public/models/globe/globe.gltf -t -k -m
```

We can now include the JSX models to our scene, and we should see something work out, let's correct the files as we proceed:
- urls
- scaling
- positioning
- contents

Let's fix the light orbiting the globe.

Let's place the plane model as well, and try to fix its scale and orientation.
_(Maybe demonstrate the configurator component)_

---

### Step 3 - Let's fly around the globe
This section will contain some maths that we tried to keep to the minimum, not to disturb the flow of the workshop.

For the application code not to get too crowded, it is useful to introduce some layers of abstraction.
I'd introduce one that separates the model of a plane from a flight that is supposed to fly between two cities:
- The plane model bears the responsibility of drawing a plane straight, towards the -Z axis
- The flight is representing one of these plane models in flight (taking care of movement)

Let's create a new file `Flight.tsx` close to the `FlightsScene.tsx`.

```typescript jsx
// We'll basically need this in a component:
const rotationBoxRef = useRef<Group>();
const flightContainerRef = useRef<Group>();
return (
<group ref={rotationBoxRef}>
  <group ref={flightContainerRef} position-y={GLOBE_BASE_RADIUS * GLOBE_SCALE + FLOAT_HEIGHT}>
    {/* ^ This box is a convenience because it's hard to forward ref to inside the airplane */}
    <Airplane scale={PLANE_SCALE} />
  </group>
</group>
)
```

After this, the flight should appear on top of the world, around the North Pole.

If you're brave, you can try to use your own 3D maths, since there's a dozen ways of position/rotate the flight -
I'll show you one, that's pretty convenient.

First, the simplest; the flight can be moved by rotating the bounding box over time:
```typescript jsx
  useFrame((state, delta) => {
    if (rotationBoxRef.current) {
      const angle = Math.PI * 2 / 4 * delta;
      rotationBoxRef.current.rotateOnAxis(LEFT, angle);
    }
  });
```

The small issue with this method, is that it's harder to calculate increments between steps to get to a correct end state.

Another method is called interpolation.
_Interpolation in general is taking the start and end states, and calculate steps in-between, using a phase indicator._

Let's try this for rotating our airplane:
```typescript jsx
  useFrame((state, delta) => {
    const startQuaternion = new Quaternion().setFromAxisAngle(LEFT, 0)
    const midQuaternion = new Quaternion().setFromAxisAngle(LEFT, Math.PI)
    const endQuaternion = new Quaternion().setFromAxisAngle(LEFT, Math.PI * 2)
    if (rotationBoxRef.current) {
      const phase = (state.clock.elapsedTime % 3) / 3;

      const rotationQuaternion = new Quaternion();
      if (phase < 0.5) { // because of rotation optimization
        rotationQuaternion.slerpQuaternions(startQuaternion, midQuaternion, phase * 2);
      } else {
        rotationQuaternion.slerpQuaternions(midQuaternion, endQuaternion, (phase - 0.5) * 2);
      }
      
      rotationBoxRef.current.setRotationFromQuaternion(rotationQuaternion);
    }
  });
```

We can abstract the `Sun` similarly to an object in the scene that takes care of its orbit,
even add a visible model to show where the sun currently is.

---

### Step 4 - Budapest - Sydney!

Let's step up our game a notch. Let's include exact positions on the planet, and let's set up chartered flights between two points. For example, between Budapest and Sydney.

It will require two things:
- associate our known geolocations with rotation quaternions
- and moving the plane between these two

Well - since we already know how to interpolate quaternions, we only need to figure out the first one! Let's get on it!

Oh, maybe one more thing... Let's load some data!
We can use the generator to generate some data:
```shell
yarn generate-data
```

Then we can load this data in `FlightsScene.tsx` with `useEffect` (pay attention to the dependencies, not to re-run it) - and find Sydney and Budapest.

Now - calculating the rotation quaternion from the cities are not that difficult,
once you know you can multiply quaternions, you'll basically need to rotate the containing box of the aircraft with the right latitude and longitude amounts.

Lucky for you, you can save this work by using the `rotationQuaternionForCoordinates` function from the utilities we provide for you.

```typescript jsx
if (rotationBoxRef.current){
  const q = rotationQuaternionForCoordinates(city.latitude, city.longitude);
  rotationBoxRef.current?.setRotationFromQuaternion(q);
}
```

Pass the cities to the flights, and let's see if the flights appear on the map:
```typescript jsx
// Pass the filtered city data to the flights:
  <Flight city={budapest!} />
  <Flight city={sydney!} />
```

It's this easy, you ask?
Well, sort of... (long detailed tangent about world coordinates and how orienting the flight might not be that easy);

Now, we can try to move the flights between the two cities:

```typescript jsx
  useFrame((state, delta) => {
    const startQuaternion = rotationQuaternionForCoordinates(from.latitude, from.longitude);
    const endQuaternion = rotationQuaternionForCoordinates(to.latitude, to.longitude);


    if (rotationBoxRef.current && flightContainerRef.current) {
      const flightTime = 4;
      const phase = (state.clock.elapsedTime % flightTime) / flightTime;
      const worldPositionBefore = flightContainerRef.current.getWorldPosition(new Vector3());

      const rotationQuaternion = new Quaternion();
      rotationQuaternion.slerpQuaternions(startQuaternion, endQuaternion, phase);
      rotationBoxRef.current.setRotationFromQuaternion(rotationQuaternion);

      flightContainerRef.current.lookAt(worldPositionBefore);
      flightContainerRef.current.rotation.z = 0;
    }
  });
```

---

### Step 5 - Let there be (f)light(s)!

In this step, we'll make use of the generated flight data, and visualize a LOT of flights at the same time, now that we know how to!

Let's load both data sources, and extract the interesting bits of them:
```typescript jsx
  useEffect(() => {
  fetch('/data/airports.json', {})
    .then((airportsResponse) => airportsResponse.json())
    .then((airportsJson: IAirport[]) => {
      const airportsMap = indexBy(e=>e.id, airportsJson);

      setAirportsMap(airportsMap);
      setAirportList(airportsJson);
    });
}, []);

useEffect(() => {
  fetch('/data/flights.json', {})
    .then((flightsResponse) => flightsResponse.json())
    .then((flightsJson) => flightsJson.map(parseFlightDates))
    .then((flightsJson: IFlight[]) => setFlightsList(flightsJson));
}, []);
```

Let's limit the number of flights rendered, and use a react-like array expansion to show all the flights:
```typescript jsx
  const renderedFlights = flightsList.slice(0, 10);

  return (
    <>
      <OrbitControls />
      <Sun />
      <Globe />
      {renderedFlights.map((flight) => {
        const from = airportsMap[flight.departureAirportId];
        const to = airportsMap[flight.arrivalAirportId];
        return <Flight key={flight.id} from={from} to={to} />;
      })}
    </>
  )
```

And there you have it! You now have a bunch of chartered flights going from cities to other cities!

---

### Step 6 - Cities

A quite easy task now, with all our knowledge to visualize all the cities for the airports we have.
Let's create a new object: `flightsScene/Airport.tsx`, and on this simple object, we can demonstrate how easy mouse-interaction is to set up.

```typescript jsx
// This function component should only take an IAirport object and render it on the map
// Using the same bounding box rotation method, we can draw a simple square/box to any geo-location easily
    <group ref={rotationBoxRef} quaternion={rotationQuaternion}>
      <Box
        size={[0.05, 0.05, 0.05]}
        color={'hotpink'}
        position={[0, EARTH_SURFACE_ELEVATION, 0]}
      />
    </group>
```

If you create a piece of state to hold the hover-state, then we can conditionally change the color of the box:
```typescript jsx
    const [hover, setHover] = useState(false);
    const rotationQuaternion = rotationQuaternionForCoordinates(props.airport.latitude, props.airport.longitude);
// ...
   return (
    <group ref={rotationBoxRef} quaternion={rotationQuaternion}>
      <Box
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        size={[0.05, 0.05, 0.05]}
        color={hover ? 'hotpink' : 'red'}
        position={[0, EARTH_SURFACE_ELEVATION, 0]}
      />
    </group>
   )
```

And while we're at it, let's showcase HTML on the canvas too!

`Three.js` can project the world's coordinates on the screen for us, and move HTML dom elements on top of the canvas floating on their screen position.
Let's add an info label right next to our simple box that shows some info about the airport when hovered:

```typescript jsx
  {hover ? (
    <Html position-y={EARTH_SURFACE_ELEVATION}>
      <div className="info-bubble">
        <div>[{props.airport.city}]</div>
        <div>{props.airport.id}</div>
        <div>
          ({props.airport.latitude};{props.airport.longitude})
        </div>
        <a href={`https://en.wikipedia.org/wiki/${props.airport.city}`}>wikipedia</a>
      </div>
    </Html>
  ) : null}
```

Lastly, if you want to make it a bit more interesting, add a light to the city to show where they are:
```typescript jsx
      <Sphere
        position={LIGHT_POSITION}
        baseColor={hover ? 'limegreen' : 'red'}
      />
      <pointLight
        ref={lightRef}
        color={hover ? 'limegreen' : 'red'}
        position={LIGHT_POSITION}
      />

// where:
const EARTH_SURFACE_ELEVATION = GLOBE_BASE_RADIUS * GLOBE_SCALE;
const LIGHT_POSITION: Number3 = [0, EARTH_SURFACE_ELEVATION + 0.04, 0];
const CITY_POSTION: Number3 = [0, EARTH_SURFACE_ELEVATION, 0];
```

...and you can turn this a bit more alive with some animation:
```typescript jsx
useFrame((state, delta) => {
  if(lightRef.current) {
    const blinkPeriod = 3;
    const phase = (state.clock.elapsedTime % blinkPeriod)/blinkPeriod;
    lightRef.current.intensity = Math.sin(phase * Math.PI *2) * 0.5 + 0.5;
  }
});
```
Or by only conditionally rendering the light, or tying the intensity of the light to the hover state. Get creative :)
```typescript jsx
{
  hover && <pointLight
    ref={lightRef}
    color={hover ? 'limegreen' : 'red'}
    position={LIGHT_POSITION}
  />
}
```

---

### Step 7 - Filtering and selecting flights
Here comes a big one!

Since this is react, we can use our already familiar ways to filter/sort/select/interact with data.

The workshop tries to focus on the `react`+`threejs` marriage, we'll save you the time of having to write a fancy-fancy filtering UI, that
will allow very basic listing/interaction with the flights' data - you can use `FlightFilterControls` for listing the flights.

Keep in mind, the gateway to the magical 3D world is the `<Canvas>` tag within which, only `@react-three/fiber`'s components are valid.
We'll want to use conventional html elements to visualize the data control panels. For this we'll have to lift out the data to the App's level:

```typescript jsx
// in FlightVisualizationApp.tsx
    <FlightsScene 
        flightsList={flightsList}
        airportsList={airportsList}
        airportsMap={airportsMap}
    />
```

Now we can tuck this data in to a component next to `<Canvas>` outside of its context.

```typescript jsx
<aside className="controlPanel">
  <FlightFilterControls
    flights={flightsList}
    airports={airportsList}
    airportMap={airportsMap}
    maxFlightCount={20}
    simulationTime={now}
    selectedFlight={selectedFlight}
    setSelectedFlight={setSelectedFlight}
    onFilteringChanged={setFilteredFlights}
  />
</aside>
```

If you wire in everything right - you should be able to filter flights, and visualize them on the map.

Let's also switch out the fix 20 limitation on the flight number to something that's controlled by another pre-made control:

```typescript jsx
const [maxFlightCount, setMaxFlightCount] = useState(20);

<div className="input-controls">
  <div>Current date: {prettyDate(now)}</div>
  <SimulationSizeControl onMaxFlightCountChange={setMaxFlightCount} />
</div>
```

If the wiring is right once again, then the slider should limit/unlimit the amount of rendered flights! Go nuts!

...

And I promised selection too...

We already know that `Three.js` objects support `onPointerOver` events - well, so do they support `onClick`.
We can add this `onClick` handler to our inside the `Flight` object's `Plane` model.

Let's implement a selected state and wire the selection event through with setters that we define outside in the common scope.

```typescript jsx
// in FlightVisualizationApp.tsx
<FlightsScene
  flightsList={filteredFlights}
  airportsList={airportsList}
  airportsMap={airportsMap}
  selectedFlight={selectedFlight}
  setSelectedFlight={setSelectedFlight}
/>

// in FlightsScene.tsx
const selected = selectedFlight?.id === flight.id;
// return 
<Flight
  key={flight.id}
  flight={flight}
  from={from}
  to={to}
  selected={selected}
  onFlightClicked={() => setSelectedFlight(flight)}
/>

// in Plane.tsx
<Airplane selected={selected} onClick={(event) => onFlightClicked(flight, event)} />
```

A small bonus: you can add the flight's ID as a floating info-bubble on the selected flight like we did with the cities:
```typescript jsx
{ selected && <Html><div className={'info-bubble'}>{flight.id}</div></Html> }
<Airplane selected={selected} onClick={(event) => onFlightClicked(flight, event)} />
```

---

### Step 8 - Global time
This one is a difficult one, but it's really worth the effort.

We're going to implement a global simulation time that's inherently driving the whole simulation.
Yes, everything is already moving, yes, we're already using the `state.clock.elapsedTime` variable, but it just doesn't line up with the time of the flights.
_(Plus this section shows a nifty trick that you might need in your own simulations too)_.

The speciality of this simulation timer is that we can change the speed of the simulation on a controller, and the world would react accordingly.
This would not be difficult in a pure `three.js` world,
but it's a bit more difficult with all the `react` world where updating some state is very costly (`setState/useState` calls, or re-renders with `ReactContext`).

So let's start!

```typescript jsx
// We can use this SimulationSpeedControl - that's pre-written for some simple speed control:
<SimulationSpeedControl onSimulationSpeedChange={setSimulationSpeed} />
```

Once we sneak this variable inside the magic gates of the 3D context, we can start summarizing the `useFrame`'s deltas, that we scale with the simulation speed.
```typescript jsx
  useFrame((state, delta) => {
    const clock = state.clock as any;
    const worldTimeMs = clock.hackedWorldTime || Date.now();
    const worldTimeAfterTick = worldTimeMs + Math.floor(delta * 1000 * simulationSpeed);
    clock.hackedWorldTime = worldTimeAfterTick;

    if (getMinutes(worldTimeMs) !== getMinutes(worldTimeAfterTick)) {
      props.onSimulationMinuteTick(worldTimeAfterTick);
    }
    // There's currently no good way of propagating globally calculated information besides using unsafe javascript and piggybacking on global objects.
    // The alternatives are setState and contexts, but that's a really big performance hit.
  });
```

So what we did above, is we added an unsafe variable (`hackedWorldTime`) piggybacking on the global threejs state object.
We can increment this without any cost in this `useFrame` loop, and we can retrieve this variable in other `useFrame`s.

_Note: I named it "hacked" because it feels a bit outside of the suggested limits of what the react-three world would normally allow us to do, especially with typescript being so strict along the way._

⚠️But: Since we can only use this hook within the `<Canvas>` context,
we will need to sneak some updates outside to the control panel (so we can use that for showing the time, and filtering "current" flights).

Let's inject a `onSimulationMinuteTick` into the scene, and use that to bubble up some updates at least once a minute in the simulation.

Now that we have access to the global world time in whichever `useFrame`, we can simply re-write our phase to be based on the global time and how it relates to the flight's departure/arrival times:
```typescript jsx
      const phase = calculatePhase(
        Number(flight.departureTime),
        Number(flight.arrivalTime),
        globalWorldTime
      );

// where:
function calculatePhase(startTimestamp: number, endTimestamp: number, currentTimestamp: number, shouldLimit: boolean = true) {
  const fullRange = endTimestamp - startTimestamp;
  const currentProgress = currentTimestamp - startTimestamp;
  if (shouldLimit) {
    return Math.min(1, Math.max(0, currentProgress / fullRange));
  } else {
    return currentProgress / fullRange;
  }
}
```

**Boom!** Flights are now accurately following flight times between the destination cities. You can use these principles for any strictly-timed animation. Otherwise, use `react-spring`.

While we're here, let's correct, and make the sun's orbit a bit more realistic using the same method:

Our `useFrame` will look like this for the sun:
```typescript jsx
  useFrame((state, delta) => {
    const time = (state.clock as any).hackedWorldTime;
    const phase = (time % ORBIT_PERIOD_24H) / ORBIT_PERIOD_24H;
    const phaseRadians = Math.PI * 2 * phase + Math.PI;

    if (ref.current) {
      const x = Math.sin(phaseRadians) * ORBIT_DISTANCE;
      const z = Math.cos(phaseRadians) * ORBIT_DISTANCE;
      ref.current.position.set(x, 0, z);
    }
  });
```

And this concludes the main points we wanted to cover. We can do further fine-tuning, if we have time. Some ideas are:

- On-click flight information, similar to the city information bubbles + Highlight origin/destination for selected flights
- Prettier flight paths & scale-to-disappear for flights. Maybe spring-like animations for a comic-y feel
- Different camera setups - for example: flight POV
- Use cooler models :)
- Improve performance through instancing
- Improve the lighting setup (directional lights instead of point-lights)
- Better filtering options

**You can get a lot more ideas of what's possible with react-three in here**: https://docs.pmnd.rs/react-three-fiber/getting-started/examples

**Thanks for joining us!**
