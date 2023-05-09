const scale = 10;
const blinkDuration = 80;
const decay = 0.3;
const pathOpen = "M10 50 C 30 20, 70 20, 90 50 C 70 80, 30 80, 10 50 Z";
const pathClosed = "M10 50 C 30 50, 70 50, 90 50 C 70 50, 30 50, 10 50 Z";

class EyeGraphic extends HTMLElement {
  target = {
    x: 0,
    y: 0,
  };

  direction = {
    x: 0,
    y: 0,
  };

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("eye-graphic-template");
    this.shadowRoot.append(template.content.cloneNode(true));

    this.eye = this.shadowRoot.querySelector('[data-id="eye"]');
    this.pupil = this.shadowRoot.querySelector('[data-id="pupil"]');
    this.animation = this.shadowRoot.querySelector('[data-id="animation"]');
    this.lids = this.shadowRoot.querySelector('[data-id="lids"]');

    console.log(this.lids);

    this.lids.setAttribute("d", pathOpen);
    this.animation.setAttribute("dur", `${blinkDuration}ms`);
    this.animation.setAttribute("from", pathOpen);
    this.animation.setAttribute("to", pathClosed);
  }

  beginCloseAnimation() {
    this.animation.setAttribute("from", pathOpen);
    this.animation.setAttribute("to", pathClosed);
    this.animation.beginElement();
  }

  beginOpenAnimation() {
    this.animation.setAttribute("from", pathClosed);
    this.animation.setAttribute("to", pathOpen);
    this.animation.beginElement();
  }

  update() {
    const dx = this.target.x * scale - this.direction.x;
    const dy = this.target.y * scale - this.direction.y;
    this.direction.x += dx * decay;
    this.direction.y += dy * decay;
    this.pupil.style.transform = `translate3d(${this.direction.x}px, ${this.direction.y}px, 0)`;
  }

  look(x, y) {
    this.target.x = x;
    this.target.y = y;
  }

  blinkOnce() {
    this.beginCloseAnimation();
    setTimeout(() => this.beginOpenAnimation(), blinkDuration);
  }

  blinkTwice() {
    this.beginCloseAnimation();
    setTimeout(() => this.beginOpenAnimation(), blinkDuration);
    setTimeout(() => this.beginCloseAnimation(), blinkDuration * 3);
    setTimeout(() => this.beginOpenAnimation(), blinkDuration * 4);
  }
}

customElements.define("eye-graphic", EyeGraphic);

const elements = document.querySelectorAll("eye-graphic");

function setRandomInterval(fn, min, max) {
  const duration = min + Math.random() * (max - min);
  setTimeout(() => {
    fn();
    setRandomInterval(fn, min, max);
  }, duration);
}

function update() {
  for (const element of elements) {
    element.update();
  }

  requestAnimationFrame(update);
}

update();

setRandomInterval(
  () => {
    const r = Math.random();

    const args =
      r > 0.3 ? [Math.random() * 2 - 1, Math.random() * 2 - 1] : [0, 0];

    for (const element of elements) {
      element.look(...args);
    }
  },
  1000,
  4000
);

setRandomInterval(
  () => {
    const r = Math.random();

    for (const element of elements) {
      if (r > 0.66) {
        element.blinkOnce();
      } else if (r > 0.33) {
        element.blinkTwice();
      }
    }
  },
  3000,
  4000
);

// const eye = document.getElementById("eye");
// const pupil = document.getElementById("pupil");
// const animation = document.getElementById("animation");
// const lidsPath = document.getElementById("lids-def-path");

// const scale = 10;

// const blinkDuration = 80;

// // Open and closed outer eye paths to animate between when blinking.
// const pathOpen = "M10 50 C 30 20, 70 20, 90 50 C 70 80, 30 80, 10 50 Z";
// const pathClosed = "M10 50 C 30 50, 70 50, 90 50 C 70 50, 30 50, 10 50 Z";

// lidsPath.setAttribute("d", pathOpen);
// animation.setAttribute("dur", `${blinkDuration}ms`);
// animation.setAttribute("from", pathOpen);
// animation.setAttribute("to", pathClosed);

// let dimensions = {
//   x: window.innerWidth,
//   y: window.innerHeight,
// };

// // The target direction. This is used to keep track of where the eye is animating to
// let target = {
//   x: 0,
//   y: 0,
// };

// // The current direction of the eye where [0, 0] is straight ahead.
// let direction = {
//   x: 0,
//   y: 0,
// };

// function beginCloseAnimation() {
//   animation.setAttribute("from", pathOpen);
//   animation.setAttribute("to", pathClosed);
//   animation.beginElement();
// }

// function beginOpenAnimation() {
//   animation.setAttribute("from", pathClosed);
//   animation.setAttribute("to", pathOpen);
//   animation.beginElement();
// }

// function setTarget(x, y) {
//   target.x = x;
//   target.y = y;
// }

// // Update the dimensions on resize.
// window.addEventListener("resize", () => {
//   dimensions.x = window.innerWidth;
//   dimensions.y = window.innerHeight;
// });

// /*
//   Update the position of the pupil based on the target vector.
// */
// function draw() {
//   // Smooth animation.
//   const dx = target.x * scale - direction.x;
//   const dy = target.y * scale - direction.y;
//   direction.x += dx * 0.3;
//   direction.y += dy * 0.3;

//   // Update the pupil transform.
//   pupil.style.transform = `translate3d(${direction.x}px, ${direction.y}px, 0)`;

//   // Continue the animation loop.
//   requestAnimationFrame(draw);
// }

// /*
//   Blink a few times.
// */
// function blink() {
//   const r = Math.random();

//   if (r > 0.66) {
//     // Blink once.
//     beginCloseAnimation();
//     setTimeout(beginOpenAnimation, blinkDuration);
//   } else if (r > 0.33) {
//     // Blink twice.
//     beginCloseAnimation();
//     setTimeout(beginOpenAnimation, blinkDuration);
//     setTimeout(beginCloseAnimation, blinkDuration * 3);
//     setTimeout(beginOpenAnimation, blinkDuration * 4);
//   }
// }

// /*
//   Look in a new direction.
// */
// function look() {
//   const r = Math.random();

//   if (r > 0.3) {
//     // Look in a random direction.
//     const x = Math.random() * 2 - 1;
//     const y = Math.random() * 2 - 1;

//     setTarget(x, y);
//   } else {
//     // Look straight ahead.
//     setTarget(0, 0);
//   }
// }

// function setRandomInterval(fn, min, max) {
//   const duration = min + Math.random() * (max - min);
//   setTimeout(() => {
//     fn();
//     setRandomInterval(fn, min, max);
//   }, duration);
// }

// requestAnimationFrame(draw);
// setRandomInterval(look, 1000, 4000);
// setRandomInterval(blink, 3000, 4000);
