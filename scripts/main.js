import loop from 'raf-loop'
import vec2 from 'gl-vec2'
import SizzleCanvas from './sizzle'

const videos = Array.from(document.querySelectorAll('.header-video'))
const canvas = document.querySelector('#header-canvas')
const context = canvas.getContext('2d')

const sizzleCanvas = new SizzleCanvas(canvas, videos)

let mousePosition = vec2.create()

window.addEventListener('resize', () => {
    sizzleCanvas.fit()
})

window.addEventListener('mousemove', (event) => {
    const nextMouse = vec2.fromValues(event.clientX, event.clientY)
    const velocity = vec2.subtract([], nextMouse, mousePosition)
    mousePosition = nextMouse

    sizzleCanvas.handleMouseMove(velocity)
})

window.setInterval(() => {
    sizzleCanvas.next()
}, 2000)

const appLoop = loop(() => {
    sizzleCanvas.draw(context)
})

appLoop.start()
