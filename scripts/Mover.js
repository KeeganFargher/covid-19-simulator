"use strict";

function Mover(x, y, infectedParam, susceptibleParam, removedParam) {
	let infected = infectedParam;
	let susceptible = susceptibleParam;
	let removed = removedParam;

	const position = createVector(x, y);

	const velocity = createVector(random(-3, 3), random(-2, 2));
	velocity.mult(5);

	const acceleration = createVector(0, 0);

	function update() {
		if (removed) return;

		// Update velocity
		velocity.add(acceleration);

		// Limit speed
		velocity.limit(MAX_SPEED);
		position.add(velocity);

		// Reset accelertion to 0 each cycle
		acceleration.mult(0);
	}

	function boundaries() {
		let desired = null;

		if (position.x < BOUNDARY) {
			desired = createVector(MAX_SPEED, velocity.y);
		} else if (position.x > width - BOUNDARY) {
			desired = createVector(-MAX_SPEED, velocity.y);
		}

		if (position.y < BOUNDARY) {
			desired = createVector(velocity.x, MAX_SPEED);
		} else if (position.y > height - BOUNDARY) {
			desired = createVector(velocity.x, -MAX_SPEED);
		}

		if (desired != null) {
			desired.normalize();
			desired.mult(MAX_SPEED);
			const steer = p5.Vector.sub(desired, velocity);
			steer.limit(MAX_FORCE);
			applyForce(steer);
		}
	}

	// Separation
	// Method checks for nearby vehicles and steers away
	function separate(movers, factor) {
		if (removed) return;

		const desiredSeperation = RADIUS * factor;

		const sum = createVector(0, 0);

		let count = 0;

		movers.forEach(other => {
			if (other.getRemoved()) return;

			const distance = p5.Vector.dist(position, other.getPosition());

			/* SEPERATED */
			if (distance > 0 && distance < desiredSeperation && !other.getRemoved()) {
				// Calculate vector pointing away from neighbor
				let diff = p5.Vector.sub(position, other.getPosition());

				diff.normalize();

				diff.div(distance); // Weight by distance

				sum.add(diff);

				count++; // Keep track of how many
			}

			/* INFECTION */
			if (!removed && infected && !other.getInfected()) {
				const infectionChance = random(0, 1);
				if (distance < INFECTION_RADIUS && infectionChance < SPREAD_CHANCE / 100 && distance > 0) {
					other.setInfected();
				}
			}
		});

		// Average -- divide by how many
		if (count > 0) {
			// Our desired vector is moving away maximum speed
			sum.setMag(MAX_SPEED);
			// Implement Reynolds: Steering = Desired - Velocity
			let steer = p5.Vector.sub(sum, velocity);
			steer.limit(MAX_FORCE);
			applyForce(steer);
		}

		if (infected && !removed) {
			const deathChance = random(0, 1);

			// Kill em
			if (deathChance < DEATH_CHANCE / 1000) {
				removed = true;
				deadCount++;
				infectedCount--;
			}

			const recoverChance = random(0, 1);

			// you are cured
			if (recoverChance < 0.001) {
				infected = false;
				removed = false;
				susceptible = true;

				infectedCount--;
				susceptibleCount++;
			}
		}
	}

	function applyForce(force) {
		acceleration.add(force);
	}

	function getPosition() {
		return position;
	}

	function getRemoved() {
		return removed;
	}

	function getInfected() {
		return infected;
	}

	function setInfected() {
		if (!removed) {
			if (!infected) {
				infectedCount++;
				susceptibleCount--;
			}
			infected = true;
		}
	}

	function show() {
		if (infected && !removed) {
			strokeWeight(3);
			stroke("#b8483d");
			fill(0, 0);
			ellipse(position.x, position.y, RADIUS * radiusAnimator);
		}

		strokeWeight(0);

		if (removed) {
			fill("#363636");
		} else if (infected) {
			fill("#e74c3c");
		} else if (susceptible) {
			fill("#3498db");
		} else {
			fill(255, 255, 255);
		}

		ellipse(position.x, position.y, RADIUS);
	}

	return { update, show, boundaries, applyForce, separate, getPosition, infected, setInfected, getRemoved, getInfected };
}
