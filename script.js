var frameRequest,
    button,
    list,
    svg,
    svgBounds,
    menuIsOpen = false,
    hovering = false;

var focalLength = 10,
    cameraDistance = 2,
    rotationSpeed = 0.001,
    planetCount = 10,
    planetRadius = 0.03,
    planetSeparation = 0.1,
    planets = [];

class Planet {
    constructor(radius) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r = radius;

        // Create a new svg element
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.element.onmouseover = function() {
            hovering = true;
        }
        this.element.onmouseout = function() {
            hovering = false;
        }
        svg.appendChild(this.element);
    }

    // Convert 3D coordinates to 2D coordinates and scale, updates svg element
    project() {
        var scale = Math.min(svgBounds.width, svgBounds.height),
            perspective = focalLength / (focalLength + this.z + cameraDistance);
        this.element.setAttribute("cx", this.x * perspective * scale + (svgBounds.width / 2));
        this.element.setAttribute("cy", this.y * perspective * scale + (svgBounds.height / 2));
        this.element.setAttribute("r", this.r * perspective * scale);
    }
}

function updatePlanets() {
    // Rotate planet positions around Y axis
    var cos = Math.cos(rotationSpeed),
        sin = Math.sin(rotationSpeed);
    for (var i = 0; i < planetCount; i++) {
        var p = planets[i];
        x = p.x * cos - p.z * sin,
        z = p.z * cos + p.x * sin;
        p.x = x;
        p.z = z;
    }

    // Sort planets by z value
    planets.sort(function(a, b) {
        return b.z - a.z;
    });

    for (var i = 0; i < planetCount; i++) {
        var p = planets[i];

        // Don't update DOM if hovering because it resets hover status
        if (!hovering) {
            // Update DOM order according to order of zsorted planet list
            svg.insertBefore(p.element, null);
        }

        // Update element position and scale.
        p.project();
    }

    // Continue animation
    frameRequest = requestAnimationFrame(updatePlanets);
}

function startPlanets() {
    frameRequest = requestAnimationFrame(updatePlanets);
}

function stopPlanets() {
    cancelAnimationFrame(frameRequest);
}

function toggleMenu() {
    if (menuIsOpen) {
	stopPlanets();
	menu.classList.remove("open");
	menuIsOpen = false;
    }
    else {
	startPlanets();
	menu.classList.add("open");
	menuIsOpen = true;
    }
}

window.onload = function() {
    button = document.getElementById("menu-button");
    list = document.getElementById("project-list");
    svg = document.getElementById("planet-svg"),
    svgBounds = svg.getBoundingClientRect();

    for (var i = 0; i < planetCount; i += 1) {
	if (i == 0) {
	    // The sun is actually just the first planet
	    planets.push(new Planet(planetRadius * 3));
	}
	else {
	    var planet = new Planet(planetRadius + (Math.random() * planetRadius));

	    // Assign random position within boundaries
	    planet.x = Math.random() - 0.5;
	    planet.y = Math.random() - 0.5;
	    planet.z = Math.random() - 0.5;
	    planets.push(planet);
	}
    }
    // Update size of parent svg when window resizes
    document.body.onresize = function() {
	svgBounds = svg.getBoundingClientRect();
    }
};
