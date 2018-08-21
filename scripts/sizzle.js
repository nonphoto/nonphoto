import loop from 'raf-loop'

const video = document.querySelector('.header-video')
const canvas = document.querySelector('#header-canvas')
const context = canvas.getContext('2d')

video.play()


canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const scale = canvas.height / video.videoHeight
const width = video.videoWidth * scale
const cloneCount = canvas.width / width

loop(() => {
    for (let i = 0; i < cloneCount; i++) {
        context.drawImage(video, i * width, 0, width, canvas.height)
    }
}).start()
