// cd76661 (HEAD -> workshop-end) Step 8 - correct flight times / orbit time
// 4efa672 Step 8/1 - set up hacked time, wire it in to the simulation controls
// 97ec060 Step 7 - Filtering and selecting flights
// a3be721 Step 6 - cities
// 822dc37 Step 5 - Let there be (f)light(s)
// 27aec7b Step 4 - Budapest - Sydney
// 31974d5 Step 3 - Let's fly around the globe
// a173d48 Step 2 - Introduce external models
// eb54755 Step 1 - @react-three Hello-world
// 847633e (origin/workshop-start, workshop-start) Final refinements on the end state

const child_process = require('child_process');
const target = process.argv[2];

const targetState = {
  '8/2': ['cd76661', 'Step 8 - correct flight times / orbit time'],
  '8/1': ['4efa672', 'Step 8/1 - set up hacked time, wire it in to the simulation controls'],
  '7': ['97ec060', 'Step 7 - Filtering and selecting flights'],
  '6': ['a3be721', 'Step 6 - cities'],
  '5': ['822dc37', 'Step 5 - Let there be (f)light(s)'],
  '4': ['27aec7b', 'Step 4 - Budapest - Sydney'],
  '3': ['31974d5', 'Step 3 - Let\'s fly around the globe'],
  '2': ['a173d48', 'Step 2 - Introduce external models'],
  '1': ['eb54755', 'Step 1 - @react-three Hello-world']
}[target.trim()];

if (!targetState) {
  console.error(`Couldn't find corresponding state for ${target.trim()}; Options are: \n${Object.keys(targetState).join(", ")}`);
}

console.log("Stashing your changes...");

child_process.execSync('git add .', {stdio: 'pipe'});
child_process.execSync('git stash save', {stdio: 'pipe'});

console.log(`Cherry-picking: ${targetState[0]} - ${targetState[1]}`);

try {
  child_process.execSync(`git cherry-pick ${targetState[0]}`, { stdio: 'pipe' });
  console.log("Clean cherry-pick! Enjoy!")
} catch (e) {
  console.error("Unclean check-out.", e);

  console.log("Try resolving your conflicts before progressing.");
}
