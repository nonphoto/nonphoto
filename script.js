"use strict";

var frameRequest,
filterLeft,
filterRight,
svg,
width,
height;

var focalLength = 60,
cameraDistance = 50,
rotationSpeed = 0.001,
planetRadius = 3,
planets = [],
menuIsOpen = false,
hovering = false;

function constructPlanet(link) {
	var planet = {
		x: 0,
		y: 0,
		z: 0,
		r: planetRadius
	};

	// Create a new svg element
	var graphicA = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var graphicB = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	var hoverOver = function() {
		link.classList.add("hover");
		graphicA.classList.add("red");
		graphicB.classList.add("cyan");
		hovering = true;
	}

	var hoverOut = function() {
		link.classList.remove("hover");
		graphicA.classList.remove("red");
		graphicB.classList.remove("cyan");
		hovering = false;
	}

	link.onmouseover = hoverOver;
	graphicA.onmouseover = hoverOver;
	graphicB.onmouseover = hoverOver;

	link.onmouseout = hoverOut;
	graphicA.onmouseout = hoverOut;
	graphicB.onmouseout = hoverOut;

	graphicA.onclick = function() {
		window.location.href = link.href;
	}

	graphicB.onclick = function() {
		window.location.href = link.href;
	}

	svg.appendChild(graphicA);
	svg.appendChild(graphicB);
	planet.graphicA = graphicA;
	planet.graphicB = graphicB;
	return planet;
}

// Convert 3D coordinates to 2D coordinates and scale, updates svg element
function projectPlanet(planet) {
	var perspective = focalLength / (focalLength + planet.z + cameraDistance);
	var x = planet.x * perspective + (width / 2);
	var y = planet.y * perspective + (height / 2);
	var r = planet.r * perspective;

	planet.graphicA.setAttribute("cx", x);
	planet.graphicA.setAttribute("cy", y);
	planet.graphicA.setAttribute("r", r);

	planet.graphicB.setAttribute("cx", x);
	planet.graphicB.setAttribute("cy", y);
	planet.graphicB.setAttribute("r", r);
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
	}

	// Sort planets by z value
	planets.sort(function(a, b) {
		return b.z - a.z;
	});

	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		// Don't update DOM if hovering because it resets hover status
		if (!hovering) {
			// Update DOM order according to order of zsorted planet list
			svg.insertBefore(p.graphicA, null);
			svg.insertBefore(p.graphicB, null);
		}

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

function toggleMenu() {
	if (menuIsOpen) {
		stopPlanets();
		document.body.classList.remove("menu-open");
		document.getElementById("menu").scrollTop = 0;
		menuIsOpen = false;
	}
	else {
		startPlanets();
		document.body.classList.add("menu-open");
		menuIsOpen = true;
	}
}

window.onload = function() {
	filterLeft = document.getElementById("filter-left");
	filterRight = document.getElementById("filter-right");
	svg = document.getElementById("planet-svg");
	width = svg.viewBox.baseVal.width;
	height = svg.viewBox.baseVal.height;

	var links = document.getElementsByClassName("planet-link");
	for (var i = 0; i < links.length; i++) {
		var p = constructPlanet(links[i]);

		if (links[i].classList.contains("about-link")) {
			p.r *= 4;
		}
		else if (links[i].classList.contains("network-link")) {
			// Assign random position within boundaries
			p.x = width * Math.random() - (width / 2);
			p.y = height * Math.random() - (height / 2);
			p.z = width * Math.random() - (width / 2);
		}
		else {
			p.r *= 2;

			// Assign random position within boundaries
			p.x = width * Math.random() - (width / 2);
			p.y = height * Math.random() - (height / 2);
			p.z = width * Math.random() - (width / 2);
		}
		planets.push(p);
	}
};
