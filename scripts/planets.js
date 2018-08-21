"use strict";

var canvas;
var context;
var width;
var height;
var frameRequest;

var focalLength = 200;
var cameraDistance = 0.1;
var planetDistance = 200;
var planetSize = 10;
var planetCount = 50;
var rotationSpeed = 0.005;
var rotationMultiplier = 0.5;
var planets = [];

// A point with spherical coordinates
var planet = {
	a: 0,
	b: 0,
	r: 0,
	update: function() {
		// Convert to cartesian coordinates
		var x = this.r * Math.sin(this.b) * Math.cos(this.a);
		var z = this.r * Math.sin(this.b) * Math.sin(this.a);
		var y = this.r * Math.cos(this.b);

		// Project into two dimensional space
		var perspective = focalLength / (focalLength + z + cameraDistance);

		// Draw to the canvas
		context.save();
		context.beginPath();
		context.translate(width / 2, height / 2);
		context.arc(x * perspective, y * perspective, planetSize, 0, 2 * Math.PI)
		context.fill();
		context.restore();
	}
};

function update() {
	context.clearRect(0, 0, canvas.width, canvas.height)

	// Rotate planets around Y axis
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		if (p.r != 0) {
			// Planets closer to the origin rotate faster
			p.a += rotationSpeed * rotationMultiplier * (planetDistance / p.r);
		}

		p.update();
	}

	// Continue animation
	frameRequest = requestAnimationFrame(update);
}

function startPlanets() {
	frameRequest = requestAnimationFrame(update);
}

function stopPlanets() {
	cancelAnimationFrame(frameRequest);
}

window.onload = function() {
	canvas = document.getElementById("planet-canvas");

	// Rescale canvas by device pixel ratio
	width = canvas.clientWidth;
	height = canvas.clientHeight;
	var scale = window.devicePixelRatio

	canvas.width = width * scale;
	canvas.height = height * scale;

	context = canvas.getContext('2d');
	context.scale(scale, scale);
	context.fillStyle =	"rgb(0, 100, 255)";

	// Construct planets
	for (var j = 0; j < planetCount; j++) {
		var p = Object.create(planet);

		// Assign random coordinates within boundaries
		p.a = Math.random() * 2 * Math.PI
		p.b = Math.random() * Math.PI;
		p.r = Math.random() * planetDistance + 50;

		planets.push(p);
	}

	// Start the animation
	startPlanets();
};
