import loop from 'raf-loop'
import Clock from './clock'
import SizzleCanvas from './sizzle'

const videos = Array.from(document.querySelectorAll('[data-sizzle-video]'))
const canvas = document.querySelector('[data-sizzle-canvas]')
const context = canvas.getContext('2d')

const sizzleCanvas = new SizzleCanvas(canvas, videos)

window.addEventListener('resize', () => {
    sizzleCanvas.fit()
})

window.addEventListener('mousemove', (event) => {
    const velocity = [event.movementX, event.movementY]

    sizzleCanvas.handleMouseMove(velocity)
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
    sizzleCanvas.draw(context)
})

const clock = new Clock(() => {
    sizzleCanvas.next()
}, 3000)

sizzleCanvas.on('canstart', () => {
    sizzleCanvas.start()
    appLoop.start()
    clock.start()
})
