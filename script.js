"use strict";

var menu;
var canvas;
var context;
var width;
var height;
var frameRequest;

var focalLength = 400;
var cameraDistance = 10;
var planetDistance = 500;
var planetSize = 3;
var rotationSpeed = 0.0002;

var planets = [];
var planetCount = 250;
var menuIsOpen = false;

var planet = {
	a: 0,
	b: 0,
	r: 0,
	update: function() {
		// var s = 1 - ((document.body.offsetHeight - window.scrollY - window.innerHeight) / window.innerHeight);
		var s = Math.max(0, 1 - (document.body.offsetHeight - window.scrollY - window.innerHeight) / menu.clientHeight);

		var x = this.r * s * Math.sin(this.b) * Math.cos(this.a);
		var z = this.r * s * Math.sin(this.b) * Math.sin(this.a);
		var y = this.r * s * Math.cos(this.b);

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

window.onload = function() {
	menu = document.getElementById("menu");
	canvas = document.getElementById("planet-canvas");

	width = canvas.clientWidth;
	height = canvas.clientHeight;
	var scale = window.devicePixelRatio

	canvas.width = width * scale;
	canvas.height = height * scale;

	context = canvas.getContext('2d');
	context.scale(scale, scale);
	context.fillStyle =	"#333344";

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
	if (window.scrollY >= document.body.offsetHeight - menu.clientHeight || window.scrollY < 0) {
		if (!menuIsOpen) {
			menuIsOpen = true;
			menu.classList.add("open");
		}
	}
	else {
		if (menuIsOpen) {
			menuIsOpen = false;
			menu.classList.remove("open");
		}
	}
}
