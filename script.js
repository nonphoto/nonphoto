"use strict";

var frameRequest;
var svg;
var width;
var height;

var focalLength = 60;
var cameraDistance = 50;
var rotationSpeed = 0.001;
var planetRadius = 1;

var planets = [];
var menuIsOpen = false;
var hovering = false;

function constructPlanet(link) {
	var planet = {
		x: 0,
		y: 0,
		z: 0,
		r: planetRadius
	};

	// Create a new svg element
	var graphic = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	var hoverOver = function() {
		link.classList.add("hover");
		graphic.classList.add("hover");
		hovering = true;
	}

	link.onmouseover = hoverOver;
	graphic.onmouseover = hoverOver;

	var hoverOut = function() {
		link.classList.remove("hover");
		graphic.classList.remove("hover");
		hovering = false;
	}

	link.onmouseout = hoverOut;
	graphic.onmouseout = hoverOut;

	graphic.onclick = function() {
		window.location.href = link.href;
	}

	svg.appendChild(graphic);
	planet.graphic = graphic;
	return planet;
}

// Convert 3D coordinates to 2D coordinates and scale, updates svg element
function projectPlanet(planet) {
	var perspective = focalLength / (focalLength + planet.z + cameraDistance);
	var x = planet.x * perspective + (width / 2);
	var y = planet.y * perspective + (height / 2);
	var r = planet.r * perspective;

	planet.graphic.setAttribute("cx", x);
	planet.graphic.setAttribute("cy", y);
	planet.graphic.setAttribute("r", r);
}

function update() {
	// Rotate planet positions around Y axis
	var cos = Math.cos(rotationSpeed);
	var sin = Math.sin(rotationSpeed);
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];
		var x = p.x * cos - p.z * sin;
		var z = p.z * cos + p.x * sin;
		p.x = x;
		p.z = z;

		// Update element position and scale.
		projectPlanet(p);
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
	svg = document.getElementById("planet-svg");
	width = svg.viewBox.baseVal.width;
	height = svg.viewBox.baseVal.height;

	var links = document.getElementsByClassName("planet-link");
	for (var i = 0; i < links.length; i++) {
		for (var j = 0; j < 10; j++) {
			var p = constructPlanet(links[i]);

			// Assign random position within boundaries
			p.x = width * Math.random() - (width / 2);
			p.y = height * Math.random() - (height / 2);
			p.z = width * Math.random() - (width / 2);

			planets.push(p);
		}
	}

	startPlanets();
};
