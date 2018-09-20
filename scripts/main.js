import loop from 'raf-loop'
import Clock from './clock'
import Spring from './spring'
import Marquee from './marquee'
import SizzleCanvas from './sizzle'

const scrollSpeed = -0.5
const mouseInfluence = 0.2

const marqueeContainers = Array.from(document.querySelectorAll('[data-marquee]'))
const videos = Array.from(document.querySelectorAll('[data-sizzle-video]'))
const canvas = document.querySelector('[data-sizzle-canvas]')
const context = canvas.getContext('2d')

const spring = new Spring()

const sizzleCanvas = new SizzleCanvas(canvas, videos)

let activeMarquee = null

marqueeContainers.forEach((container) => {
    const marquee = new Marquee(container, container.dataset.marquee)

    container.addEventListener('mouseenter', () => {
        activeMarquee = marquee
        activeMarquee.update(spring.position)
    })

    container.addEventListener('mouseleave', () => {
        activeMarquee = null
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
    else {
        sizzleCanvas.next()
        clock.start()
    }
})

const appLoop = loop(() => {
    spring.moveBy(scrollSpeed)
    spring.update()
    sizzleCanvas.draw(context, spring.position)

    if (activeMarquee) {
        activeMarquee.update(spring.position)
    }
})

const clock = new Clock(() => {
    sizzleCanvas.next()
}, 3000)

sizzleCanvas.on('canstart', () => {
    sizzleCanvas.start()
    appLoop.start()
    clock.start()
})
