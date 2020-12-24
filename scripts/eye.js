const eye = document.getElementById("eye");
const pupil = document.getElementById("pupil");
const animation = document.getElementById("animation");
const lidsPath = document.getElementById("lids-def-path");

const scale = 10;

const blinkDuration = 80;

// Open and closed outer eye paths to animate between when blinking.
const pathOpen = "M10 50 C 30 20, 70 20, 90 50 C 70 80, 30 80, 10 50 Z";
const pathClosed = "M10 50 C 30 50, 70 50, 90 50 C 70 50, 30 50, 10 50 Z";

lidsPath.setAttribute("d", pathOpen);
animation.setAttribute("dur", `${blinkDuration}ms`);
animation.setAttribute("from", pathOpen);
animation.setAttribute("to", pathClosed);

let dimensions = {
  x: window.innerWidth,
  y: window.innerHeight,
};

// The target direction. This is used to keep track of where the eye is animating to
let target = {
  x: 0,
  y: 0,
};

// The current direction of the eye where [0, 0] is straight ahead.
let direction = {
  x: 0,
  y: 0,
};

function beginCloseAnimation() {
  animation.setAttribute("from", pathOpen);
  animation.setAttribute("to", pathClosed);
  animation.beginElement();
}

function beginOpenAnimation() {
  animation.setAttribute("from", pathClosed);
  animation.setAttribute("to", pathOpen);
  animation.beginElement();
}

function setTarget(x, y) {
  target.x = x;
  target.y = y;
}

// Update the dimensions on resize.
window.addEventListener("resize", () => {
  dimensions.x = window.innerWidth;
  dimensions.y = window.innerHeight;
});

/*
  Update the position of the pupil based on the target vector.
*/
function draw() {
  // Smooth animation.
  const dx = target.x * scale - direction.x;
  const dy = target.y * scale - direction.y;
  direction.x += dx * 0.3;
  direction.y += dy * 0.3;

  // Update the pupil transform.
  pupil.style.transform = `translate3d(${direction.x}px, ${direction.y}px, 0)`;

  // Continue the animation loop.
  requestAnimationFrame(draw);
}

/*
  Blink a few times.
*/
function blink() {
  const r = Math.random();

  if (r > 0.66) {
    // Blink once.
    beginCloseAnimation();
    setTimeout(beginOpenAnimation, blinkDuration);
  } else if (r > 0.33) {
    // Blink twice.
    beginCloseAnimation();
    setTimeout(beginOpenAnimation, blinkDuration);
    setTimeout(beginCloseAnimation, blinkDuration * 3);
    setTimeout(beginOpenAnimation, blinkDuration * 4);
  }
}

/*
  Look in a new direction.
*/
function look() {
  const r = Math.random();

  if (r > 0.3) {
    // Look in a random direction.
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;

    setTarget(x, y);
  } else {
    // Look straight ahead.
    setTarget(0, 0);
  }
}

requestAnimationFrame(draw);
setInterval(look, 1000 + Math.random() * 5000);
setInterval(blink, 3000 + Math.random() * 1000);
