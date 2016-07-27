"use strict";

var frameRequest;
var canvas
var context;
var width;
var height;

var focalLength = 400;
var cameraDistance = 2;
var planetDistance = 500;
var planetSize = 2;
var rotationSpeed = 0.0001;

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
		var y = this.r * Math.cos(this.b) / 2;

		var perspective = focalLength / (focalLength + z + cameraDistance);

		context.save();
		context.beginPath();
		context.translate(width / 2, height / 2);
		context.scale(perspective, perspective);
		context.arc(x, y, planetSize, 0, 2 * Math.PI)
		context.fill();
		context.restore();
	}
};

function update() {
	context.clearRect(0, 0, canvas.width, canvas.height)

	// Rotate planet positions around Y axis
	for (var i = 0; i < planets.length; i++) {
		var p = planets[i];

		if (p.r != 0) {
			p.a += rotationSpeed * (planetDistance / p.r);
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
	canvas = document.getElementById('planet-canvas');
	width = window.innerWidth;
	height = window.innerHeight;
	var scale = window.devicePixelRatio

	canvas.width = width * scale;
	canvas.height = height * scale;
	canvas.style.width = width.toString() + "px";
	canvas.style.height = height.toString() + "px";

	context = canvas.getContext('2d');
	context.scale(scale, scale);
	context.fillStyle = "#555555";

	for (var j = 0; j < 500; j++) {
		var p = Object.create(planet);

		// Assign random position within boundaries
		p.a = Math.random() * 2 * Math.PI
		p.b = Math.random() * Math.PI;
		p.r = Math.random() * planetDistance;

		planets.push(p);
	}

	startPlanets();
};
