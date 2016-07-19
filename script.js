"use strict";

var frameRequest;
var svg;
var width;
var height;

var focalLength = 100;
var cameraDistance = 50;
var rotationSpeed = 0.001;
var planetRadius = 1;

var planets = [];
var menuIsOpen = false;
var hovering = false;

var tags = Object.create(null);

function constructPlanet() {
	var planet = {
		x: 0,
		y: 0,
		z: 0,
		r: planetRadius
	};

	// Create a new svg element
	var graphic = document.createElementNS("http://www.w3.org/2000/svg", "circle");

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

function toggleButtonForTag(element, tag) {
	element.classList.toggle("selected");
	tags[tag] = element.classList.contains("selected");

	var foundSelectedTag = false;
	var postListItems = document.getElementById("post-list").getElementsByTagName("LI");

	for (var i = 0; i < postListItems.length; i++) {
		postListItems[i].style.display = "none";
	}

	for (var tag in tags) {
		if (tags[tag]) {
			foundSelectedTag = true;
			for (var i = 0; i < postListItems.length; i++) {
				var postListItem = postListItems[i];
				if (postListItem.classList.contains("tag-" + tag)) {
					postListItem.style.display = "block";
				}
			}
		}
	}

	if (!foundSelectedTag) {
		for (var i = 0; i < postListItems.length; i++) {
			postListItems[i].style.display = "block";
		}
	}
}

window.onload = function() {
	svg = document.getElementById("planet-svg");
	width = svg.viewBox.baseVal.width;
	height = svg.viewBox.baseVal.height;

	for (var j = 0; j < 500; j++) {
		var p = constructPlanet();

		// Assign random position within boundaries
		p.x = width * Math.random() - (width / 2);
		p.y = height * Math.random() - (height / 2);
		p.z = width * Math.random() - (width / 2);

		planets.push(p);
	}

	startPlanets();
};
