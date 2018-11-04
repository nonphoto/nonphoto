import wrap from './wrap'
import once from './once'
import shuffle from 'lodash.shuffle'
import EventEmitter from 'events'

class SizzleClip extends EventEmitter {
    constructor(video, shouldUseImage = false) {
        super()

        this.mediaIsImage = shouldUseImage
        this.canStart = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        console.log('clip', this.mediaIsImage)

        if (shouldUseImage) {
            console.log('image')
            this.media = document.createElement('img')
            once(this.media, 'load').then(() => {
                this.canStart = true
                this.emit('canstart')
            })

            if (video.hasAttribute('poster')) {
                const src = video.getAttribute('poster')
                this.media.setAttribute('src', src)
            }
            else {
                throw Error('Missing fallback poster for video')
            }
        }
        else {
            console.log('video')
            this.media = video
            once(this.media, 'canplaythrough').then(() => {
                this.canStart = true
                this.emit('canstart')
            })
        }
    }

    get mediaResolution() {
        if (this.mediaIsImage) {
            return [this.media.naturalWidth, this.media.naturalHeight]
        }
        else {
            return [this.media.videoWidth, this.media.videoHeight]
        }
    }

    fit(canvasResolution) {
        if (!this.canStart) return

        const [mw, mh] = this.mediaResolution
        const [cw, ch] = canvasResolution

        const scale = ch / mh
        const width = mw * scale

        this.resolution = [width, ch]
        this.cloneCount = Math.ceil(cw / width) + 1
    }

    start() {
        if (this.mediaIsImage || !this.canStart) return

        this.media.currentTime = 0
        this.media.play()
    }

    stop() {
        if (this.mediaIsImage) return

        this.media.pause()
        this.media.currentTime = 0
    }

    draw(context, offset) {
        if (!this.canStart) return

        const [w, h] = this.resolution
        const [mw, mh] = this.mediaResolution
        const x = wrap(offset, w) - w

        for (let i = 0; i < this.cloneCount; i++) {
            const dx = x + (i * w)
            context.drawImage(this.media, 0, 0, mw, mh, dx, 0, w + 1, h + 1)
        }
    }
}

export default class SizzleCanvas extends EventEmitter {
    constructor(canvas, videos, shouldUseImages = false) {
        super()

        console.log('canvas', shouldUseImages)

        this.canvas = canvas
        this.clips = []
        this.clipIndex = 0
        this.canStart = false

        this.fit()

        shuffle(videos).forEach((video) => {
            const clip = new SizzleClip(video, shouldUseImages)

            clip.once('canstart', () => {
                console.log(clip)
                clip.fit(this.resolution)
                this.clips.push(clip)

                if (this.clips.length <= 1) {
                    this.canStart = true
                    this.emit('canstart')
                }
            })
        })

    }

    get resolution() {
        return [this.canvas.width, this.canvas.height]
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    fit() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight

        this.clips.forEach((clip) => {
            clip.fit(this.resolution)
        })
    }

    start() {
        this.currentClip.start()
    }

    next() {
        this.currentClip.stop()
        this.clipIndex = (this.clipIndex + 1) % this.clips.length
        this.currentClip.start()
    }

    draw(context, offset) {
        this.currentClip.draw(context, offset)
    }
}
