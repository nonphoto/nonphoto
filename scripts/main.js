import loop from 'raf-loop'
import SizzleCanvas from './sizzle'

const videos = Array.from(document.querySelectorAll('.header-video'))
const canvas = document.querySelector('#header-canvas')
const context = canvas.getContext('2d')

const sizzleCanvas = new SizzleCanvas(canvas, videos)

const appLoop = loop(() => {
    sizzleCanvas.draw(context)
})

appLoop.start()

window.setInterval(() => {
    sizzleCanvas.next()
}, 2000)
