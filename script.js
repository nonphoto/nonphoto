"use strict";

var frameRequest;
var svg;
var width;
var height;

var focalLength = 100;
var cameraDistance = 50;
var rotationSpeed = 0.001;
var planetRadius = 0.5;

var planets = [];
var menuIsOpen = false;
var hovering = false;

var tags = Object.create(null);

function constructPlanet() {
	var planet = {
		ax: 0,
		ay: 0,
		l: 0,
		r: planetRadius
	};

	// Create a new svg element
	var graphic = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	svg.appendChild(graphic);
	planet.graphic = graphic;
	return planet;
}

function update() {
	// Rotate planet positions around Y axis
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		if (p.l != 0) {
			p.ay += rotationSpeed * (cameraDistance / p.l);
	}

		var x = Math.cos(p.ay) * Math.cos(p.ax) * p.l;
		var y = Math.sin(p.ax) * p.l;
		var z = Math.sin(p.ay) * Math.cos(p.ax) * p.l;

		// Update element position and scale.
		var perspective = focalLength / (focalLength + z + cameraDistance);

		p.graphic.setAttribute("cx", x * perspective + (width / 2));
		p.graphic.setAttribute("cy", y * perspective + (height / 2));
		p.graphic.setAttribute("r", p.r * perspective);
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
		p.ax = (Math.random() - 0.5) * Math.PI;
		p.ay = Math.random() * 2 * Math.PI;
		p.l = Math.random() * cameraDistance * 2;

		planets.push(p);
	}

	planets.push(constructPlanet());

	startPlanets();
};
