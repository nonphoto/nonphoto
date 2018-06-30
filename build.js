const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

const entriesDirname = path.resolve(__dirname, 'assets/entries')

function read(templatePath) {
    const readPath = path.resolve(__dirname, templatePath)
    const fileString = fs.readFileSync(readPath).toString()
    return template(fileString)({ read })
}

const entries = fs.readdirSync(entriesDirname).map(entry => {
    const templatePath = path.resolve(entriesDirname, entry)
    return read(templatePath)
})

for (let entry of entries) {
    console.log(entry)
}
