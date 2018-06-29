const fs = require('fs')
const path = require('path')
const createTemplate = require('lodash.template')

const entriesDirname = path.resolve(__dirname, 'assets/entries')

const entryPaths = fs.readdirSync(entriesDirname)

const entries = entryPaths.map((entryPath) => {
    const readPath = path.resolve(entriesDirname, entryPath)
    const fileString = fs.readFileSync(readPath).toString()
    const template = createTemplate(fileString)
    return template({ 'inject': () => {
        return 'hello'
    } })
})

console.log(entries)
