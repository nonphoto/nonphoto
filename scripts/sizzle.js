import loop from 'raf-loop'

const canvas = document.querySelector('#header-canvas')
const context = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

let hue = 0

loop(() => {
    hue += 1
    hue %= 360
    context.fillStyle = `hsl(${hue}deg, 100%, 50%)`
    context.fillRect(0, 0, canvas.width, canvas.height)
}).start()
