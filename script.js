"use strict";

var frameRequest;
var ctx;
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

var planet = {
	a: 0,
	b: 0,
	r: 0,
	update: function() {
		var x = this.r * Math.sin(this.b) * Math.cos(this.a);
		var z = this.r * Math.sin(this.b) * Math.sin(this.a);
		var y = this.r * Math.cos(this.b);

		var perspective = focalLength / (focalLength + z + cameraDistance);

		ctx.beginPath();
		ctx.arc(x * perspective + 100, y * perspective + 100, planetRadius * perspective, 0, 2 * Math.PI)
		ctx.fill();
	}
};

function update() {
	ctx.clearRect(0, 0, 1000, 750)

	// Rotate planet positions around Y axis
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		if (p.r != 0) {
			p.a += rotationSpeed * (cameraDistance / p.r);
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
	// svg = document.getElementById("planet-svg");
	// width = svg.viewBox.baseVal.width;
	// height = svg.viewBox.baseVal.height;

	var canvas = document.getElementById('planet-canvas');
	var s = window.devicePixelRatio
	canvas.width = 1000;
	canvas.height = 750;
	canvas.style.width = "500px";
	canvas.style.height = "375px";
	ctx = canvas.getContext('2d');
	ctx.scale(s, s);
	ctx.fillStyle = "#ffffff";

	for (var j = 0; j < 500; j++) {
		var p = Object.create(planet);

		// Assign random position within boundaries
		p.a = Math.random() * 2 * Math.PI
		p.b = Math.random() * Math.PI;
		p.r = Math.random() * cameraDistance * 2;

		planets.push(p);
	}

	startPlanets();
};
