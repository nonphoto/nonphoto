import loop from 'raf-loop'
import SizzleCanvas from './sizzle'

const video = document.querySelector('.header-video')
const canvas = document.querySelector('#header-canvas')

video.addEventListener('canplay', () => {
    video.play()

    const sizzleCanvas = new SizzleCanvas(canvas, [video])

    const appLoop = loop(() => {
        sizzleCanvas.draw()
    })

    appLoop.start()
})
