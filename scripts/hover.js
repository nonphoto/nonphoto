const touchAttribute = 'data-is-touched'

export function onEnter(element, callback) {
    element.addEventListener('mouseenter', (event) => {
        console.log('mouseenter')
        if (element.hasAttribute(touchAttribute)) {
            console.log('prevented default')
            event.preventDefault()
            return false
        }
        else {
            console.log('called callback')
            callback()
        }
    })

    element.addEventListener('touchstart', (event) => {
        console.log('touchstart')
        element.setAttribute(touchAttribute, true)
        callback()
    })
}

export function onLeave(element, callback) {
    element.addEventListener('mouseleave', () => {
        callback()
    })

    element.addEventListener('touchend', (event) => {
        console.log('touchend')
        callback()
        setTimeout(() => {
            element.removeAttribute(touchAttribute)
        }, 500)
    })
}
