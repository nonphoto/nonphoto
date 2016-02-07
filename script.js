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
    constructor(link) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r = planetRadius;

        // Create a new svg element
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        function hoverOver() {
            link.classList.add("hover");
            circle.classList.add("hover");
            hovering = true;
        }

        function hoverOut() {
            link.classList.remove("hover");
            circle.classList.remove("hover");
            hovering = false;
        }

        link.onmouseover = hoverOver;
        circle.onmouseover = hoverOver;

        link.onmouseout = hoverOut;
        circle.onmouseout = hoverOut;

        circle.onclick = function() {
            window.location.href = link.href;
        }

        svg.appendChild(circle);
        this.circle = circle;
    }

    // Convert 3D coordinates to 2D coordinates and scale, updates svg element
    project() {
        var perspective = focalLength / (focalLength + this.z + cameraDistance);
        var x = this.x * perspective + (width / 2);
        var y = this.y * perspective + (height / 2);
        var r = this.r * perspective;

        this.circle.setAttribute("cx", x);
        this.circle.setAttribute("cy", y);
        this.circle.setAttribute("r", r);
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
            svg.insertBefore(p.circle, null);
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
    svg = document.getElementById("planet-svg");
    width = svg.viewBox.baseVal.width;
    height = svg.viewBox.baseVal.height;

    var links = document.getElementsByClassName("planet-link");
    for (var i = 0; i < links.length; i++) {
        var planet = new Planet(links[i]);

        if (links[i].classList.contains("about-link")) {
	    planet.r *= 4;
        }
        else if (links[i].classList.contains("network-link")) {
	    // Assign random position within boundaries
	    planet.x = width * Math.random() - (width / 2);
	    planet.y = height * Math.random() - (height / 2);
	    planet.z = width * Math.random() - (width / 2);
        }
        else {
	    planet.r *= 2;

	    // Assign random position within boundaries
	    planet.x = width * Math.random() - (width / 2);
	    planet.y = height * Math.random() - (height / 2);
	    planet.z = width * Math.random() - (width / 2);
        }
        planets.push(planet);
    }
};

function hoverFix()
{
    var element = this;
    var parent = element.parentNode;
    var next = element.nextSibling;
    parent.removeChild(element);
    setTimeout(function() {
	parent.insertBefore(element, next);
    }, 0)
}
