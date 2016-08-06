"use strict";

var canvas;
var context;
var width;
var height;
var frameRequest;

var focalLength = 100;
var cameraDistance = 40;
var planetDistance = 100;
var planetSize = 3;
var planetCount = 50;
var rotationSpeed = 0.005;

var planets = [];

var menuIsOpen = false;
var rotationMultiplier = 0;

var planet = {
	a: 0,
	b: 0,
	r: 0,
	update: function() {
		var x = this.r * Math.sin(this.b) * Math.cos(this.a);
		var z = this.r * Math.sin(this.b) * Math.sin(this.a);
		var y = this.r * Math.cos(this.b);

		var perspective = focalLength / (focalLength + z + cameraDistance);

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

	var j = Math.floor(Math.random() * planetCount);

	// Rotate planet positions around Y axis
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		if (p.r != 0) {
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

	width = canvas.clientWidth;
	height = canvas.clientHeight;
	var scale = window.devicePixelRatio

	canvas.width = width * scale;
	canvas.height = height * scale;

	context = canvas.getContext('2d');
	context.scale(scale, scale);
	context.fillStyle =	"#000000";

	for (var j = 0; j < planetCount; j++) {
		var p = Object.create(planet);

		// Assign random position within boundaries
		p.a = Math.random() * 2 * Math.PI
		p.b = Math.random() * Math.PI;
		p.r = Math.random() * planetDistance;

		planets.push(p);
	}

	startPlanets();
};

window.onmousemove = function(e) {
	rotationMultiplier = (e.clientX / window.innerWidth * 2) - 1;
};
