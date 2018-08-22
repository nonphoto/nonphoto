class SizzleClip {
    constructor(video, canvasResolution) {
        this.video = video

        const [canvasWidth, canvasHeight] = canvasResolution

        const scale = canvasHeight / video.videoHeight
        const width = video.videoWidth * scale

        this.resolution = [width, canvasHeight]
        this.cloneCount = Math.ceil(canvasWidth / width)
    }

    draw(context) {
        const [w, h] = this.resolution

        for (let i = 0; i < this.cloneCount; i++) {
            context.drawImage(this.video, i * w, 0, w, h)
        }
    }
}

export default class SizzleCanvas {
    constructor(canvas, videos) {
        this.canvas = canvas
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        this.clips = videos.map((video) => {
            return new SizzleClip(video, [canvas.width, canvas.height])
        })

        this.clipIndex = 0

        this.context = canvas.getContext('2d')
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    draw(context) {
        this.currentClip.draw(context)
    }
}
