import loop from 'raf-loop'
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

const appLoop = loop(() => {
    sizzleCanvas.draw(context)
})

sizzleCanvas.on('canplay', () => {
    sizzleCanvas.start()

    window.setInterval(() => {
        sizzleCanvas.next()
    }, 3000)

    appLoop.start()
})
