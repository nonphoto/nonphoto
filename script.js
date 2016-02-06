var frameRequest,
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

class Planet {
    constructor(radius, link) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r = radius;

        // Create a new svg element
        var element = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        function hoverOver() {
            link.classList.add("hover");
            element.classList.add("hover");
            hovering = true;
        }

        function hoverOut() {
            link.classList.remove("hover");
            element.classList.remove("hover");
            hovering = false;
        }

        link.onmouseover = hoverOver;
        element.onmouseover = hoverOver;

        link.onmouseout = hoverOut;
        element.onmouseout = hoverOut;

	element.onclick = function() {
            window.location.href = link.href;
        }

        svg.appendChild(element);
        this.element = element;
    }

    // Convert 3D coordinates to 2D coordinates and scale, updates svg element
    project() {
        var perspective = focalLength / (focalLength + this.z + cameraDistance);
        this.element.setAttribute("cx", this.x * perspective + (width / 2));
        this.element.setAttribute("cy", this.y * perspective + (height / 2));
        this.element.setAttribute("r", this.r * perspective);
    }
}

function updatePlanets() {
    // Rotate planet positions around Y axis
    var cos = Math.cos(rotationSpeed),
        sin = Math.sin(rotationSpeed);
    for (var i = 0; i < planets.length; i++) {
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

    for (var i = 0; i < planets.length; i++) {
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
        document.body.classList.remove("menu-open");
        menuIsOpen = false;
    }
    else {
        startPlanets();
        document.body.classList.add("menu-open");
        menuIsOpen = true;
    }
}

window.onload = function() {
    svg = document.getElementById("planet-svg");
    width = svg.viewBox.baseVal.width;
    height = svg.viewBox.baseVal.height;

    // Sun / about page
    // planets.push(new Planet(planetRadius * 3));

    var sun = new Planet(planetRadius * 4, document.getElementById("about-link"));
    planets.push(sun);
    
    var links = document.getElementsByClassName("project-link");
    for (var i = 0; i < links.length; i++) {
	var planet = new Planet(planetRadius * 2, links[i]);

	// Assign random position within boundaries
	planet.x = width * Math.random() - (width / 2);
	planet.y = height * Math.random() - (height / 2);
	planet.z = width * Math.random() - (width / 2);
	planets.push(planet);
    }
};
