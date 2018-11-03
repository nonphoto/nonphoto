const touchAttribute = 'data-is-touched'

export function onEnter(element, callback) {
    element.addEventListener('mouseenter', (event) => {
        if (element.hasAttribute(touchAttribute)) {
            event.preventDefault()
            return false
        }
        else {
            callback()
        }
    })

    element.addEventListener('touchstart', () => {
        element.setAttribute(touchAttribute, true)
        callback()
    })
}

export function onLeave(element, callback) {
    element.addEventListener('mouseleave', () => {
        callback()
    })

    element.addEventListener('touchend', () => {
        callback()
        setTimeout(() => {
            element.removeAttribute(touchAttribute)
        }, 500)
    })
}
