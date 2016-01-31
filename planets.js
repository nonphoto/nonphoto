window.onload = function() {
    var frameRequest,
	running = true,
	hovering = false;

    var svg = document.getElementById("svg"),
	svgBounds = svg.getBoundingClientRect();

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

        // Check whether this planet is too close to any other planets (unused)
        isColliding() {
            for (var i = 0; i < planets.length; i++) {
                var that = planets[i];
                var dx = this.x - that.x,
                    dy = this.y - that.y,
                    dz = this.z - that.z,
                    dr = this.r + that.r + planetSeparation;
                if (dx * dx + dy * dy + dz * dz < dr * dr) {
                    return true;
                }
            }
            return false;
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

    function update() {
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
        frameRequest = requestAnimationFrame(update);
    }

    // Start animation
    frameRequest = requestAnimationFrame(update);

    // Pause/resume on spacebar
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) {
            if (running) {
                cancelAnimationFrame(frameRequest);
                running = false;
            }
            else {
                frameRequest = requestAnimationFrame(update);
                running = true;
            }
        }
    }

    // Update size of parent svg when window resizes
    document.body.onresize = function() {
        svgBounds = svg.getBoundingClientRect();
    }
};
