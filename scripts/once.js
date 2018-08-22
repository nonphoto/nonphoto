export default function once(element, eventType) {
    return new Promise((resolve) => {
        const callback = (event) => {
            element.removeEventListener(eventType, callback)
            resolve(event)
        }

        element.addEventListener(eventType, callback)
    })
}
