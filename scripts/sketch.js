let movers;

let people = 500;

const RADIUS = 10;
const MAX_SPEED = 0.5;
const MAX_FORCE = 0.2;
const BOUNDARY = 10;

let INFECTION_RADIUS;
let INITIAL_VICTIMS;
let SPREAD_CHANCE;
let DEATH_CHANCE;

let radiusAnimator = 1.0;

let infectedCount = 0;
let susceptibleCount = people;
let deadCount = 0;

let simulationRunning = false;

function setup() {
	let canvas = createCanvas(windowWidth / 1.5, windowHeight);

	INFECTION_RADIUS = document.getElementById("infection-radius").value;
	INFECTION_RADIUS = document.getElementById("infection-radius").value;
	INITIAL_VICTIMS = document.getElementById("infection-initial-victims").value;
	SPREAD_CHANCE = document.getElementById("infection-spread-chance").value;
	DEATH_CHANCE = document.getElementById("infection-death-chance").value;

	updatePeople();

	// Move the canvas so it’s inside our <div id="sketch-holder">.
	canvas.parent("sketch-holder");
	canvas.style("display", "block");
}

function draw() {
	background(0);

	console.log(frameRate());

	const socialDistanceFactor = document.getElementById("social-distance-factor").value;

	INFECTION_RADIUS = document.getElementById("infection-radius").value;
	INFECTION_RADIUS = document.getElementById("infection-radius").value;
	INITIAL_VICTIMS = document.getElementById("infection-initial-victims").value;
	SPREAD_CHANCE = document.getElementById("infection-spread-chance").value;
	DEATH_CHANCE = document.getElementById("infection-death-chance").value;

	movers.forEach(mover => {
		simulationRunning && mover.separate(movers, socialDistanceFactor);
		mover.boundaries();
		mover.update();
		mover.show();
	});

	radiusAnimator += INFECTION_RADIUS / 20;
	if (radiusAnimator > INFECTION_RADIUS) {
		radiusAnimator = 1;
	}

	document.getElementById("infected").innerHTML = "Infected: " + infectedCount;
	document.getElementById("susceptible").innerHTML = "Susceptible: " + susceptibleCount;
	document.getElementById("dead").innerHTML = "Dead: " + deadCount;
}

function updatePeople() {
	people = document.getElementById("people").value;

	infectedCount = 0;
	deadCount = 0;

	movers = [];
	for (let i = 0; i < people; i++) {
		const posX = random(0, width);
		const poxY = random(0, height);

		const r = random(0, 1);

		let infected = false;
		let susceptible = true;
		let removed = false;

		if (r < INITIAL_VICTIMS / 100) {
			infected = true;
			infectedCount++;
			susceptibleCount--;
		}

		movers.push(Mover(posX, poxY, infected, susceptible, removed));
	}

	susceptibleCount = people;
}

function startSimulation() {
	updatePeople();
	simulationRunning = true;
}
