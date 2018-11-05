export default function processArray(array, callback) {
    let index = 0
    function next() {
        if (index < array.length) {
            const promise = callback(array[index])
            index += 1
            promise.then(next)
        }
    }
    next()
}
