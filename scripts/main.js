import * as hover from './hover.js'
import Clock from './clock.js'
import Spring from './spring.js'
import Marquee from './marquee.js'
import SizzleCanvas from './sizzle.js'
import videos from './videos.js'

const scrollSpeed = -0.5
const mouseInfluence = 0.2

const marqueeContainers = Array.from(document.querySelectorAll('[data-marquee]'))
const canvas = document.querySelector('[data-sizzle-canvas]')
const context = canvas.getContext('2d')
const spring = new Spring()
const sizzleCanvas = new SizzleCanvas(canvas, videos)

let activeMarquee = null

marqueeContainers.forEach((container) => {
    const marquee = new Marquee(container, container.dataset.marquee)
    const parent = container.parentElement

    hover.onEnter(parent, () => {
        activeMarquee = marquee
        activeMarquee.inject()
        activeMarquee.update(spring.position)
        parent.classList.add('hover')
    })

    hover.onLeave(parent, () => {
        activeMarquee = null
        parent.classList.remove('hover')
    })
})

window.addEventListener('resize', () => {
    sizzleCanvas.fit()
})

window.addEventListener('mousemove', (event) => {
    spring.moveBy(event.movementX * mouseInfluence)
})

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clock.stop()
    }
    else if (sizzleCanvas.loaded) {
        sizzleCanvas.start()
        clock.start()
    }
})

function render() {
    spring.moveBy(scrollSpeed)
    spring.update()

    sizzleCanvas.draw(context, spring.position)

    if (activeMarquee) {
        activeMarquee.update(spring.position)
    }

    requestAnimationFrame(render)
}

render()

const clock = new Clock(() => {
    sizzleCanvas.next()
}, 3000)

sizzleCanvas.load().then(() => {
    sizzleCanvas.fit()
    sizzleCanvas.start()
    clock.start()
})
