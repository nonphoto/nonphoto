import loop from 'raf-loop'
import SizzleCanvas from './sizzle'

const video = document.querySelector('.header-video')
const canvas = document.querySelector('#header-canvas')
const context = canvas.getContext('2d')


video.addEventListener('canplay', () => {
    video.play()

    const sizzleCanvas = new SizzleCanvas(canvas, [video])

    const appLoop = loop(() => {
        sizzleCanvas.draw(context)
    })

    appLoop.start()
})
