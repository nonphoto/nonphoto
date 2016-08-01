"use strict";

var frameRequest;
var canvas
var context;
var width;
var height;

var focalLength = 400;
var cameraDistance = 10;
var planetDistance = 500;
var planetSize = 3;
var rotationSpeed = 0.0002;

var planets = [];
var planetCount = 500;
var dimPlanetCount = 500;
var menuIsOpen = false;

var tags = Object.create(null);

var planet = {
	a: 0,
	b: 0,
	r: 0,
	c: "#333344",
	update: function() {
		var s = 1 - ((document.body.offsetHeight - window.scrollY - window.innerHeight) / window.innerHeight);

		var x = this.r * s * Math.sin(this.b) * Math.cos(this.a);
		var z = this.r * s * Math.sin(this.b) * Math.sin(this.a);
		var y = this.r * s * Math.cos(this.b);

		var perspective = focalLength / (focalLength + z + cameraDistance);

		context.save();
		context.fillStyle = this.c;
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
			p.a += rotationSpeed * (planetDistance / p.r);
		}

		p.update();
	}

	// Continue animation
	frameRequest = requestAnimationFrame(update);
}

function scrollToMenu() {
	window.scrollTo(0,document.body.scrollHeight);
}

function startPlanets() {
	frameRequest = requestAnimationFrame(update);
}

function stopPlanets() {
	cancelAnimationFrame(frameRequest);
}

function openMenu() {
	if (!menuIsOpen) {
		menuIsOpen = true;
		document.getElementById("menu").classList.add("open");
	}
}

function closeMenu() {
	if (menuIsOpen) {
		menuIsOpen = false;
		document.getElementById("menu").classList.remove("open");
	}
}

function toggleButtonForTag(element, tag) {
	element.classList.toggle("selected");
	tags[tag] = element.classList.contains("selected");

	var foundSelectedTag = false;
	var postListItems = document.getElementById("post-list").getElementsByTagName("A");

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
	width = canvas.clientWidth;
	height = canvas.clientHeight;
	var scale = window.devicePixelRatio

	canvas.width = width * scale;
	canvas.height = height * scale;

	context = canvas.getContext('2d');
	context.scale(scale, scale);

	for (var j = 0; j < planetCount; j++) {
		var p = Object.create(planet);

		// Assign random position within boundaries
		p.a = Math.random() * 2 * Math.PI
		p.b = Math.random() * Math.PI;
		p.r = Math.random() * planetDistance;

		planets.push(p);
	}

	startPlanets();
	window.onscroll();
};

window.onscroll = function() {
	if (window.scrollY >= document.body.offsetHeight - document.getElementById("menu").clientHeight - 10 || window.scrollY < 0) {
		openMenu();
	}
	else {
		closeMenu();
	}
}
