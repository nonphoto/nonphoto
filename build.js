const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

const src = 'assets/pages'
const dest = 'pages'

function read(filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath)).toString()
}

function evaluate(filePath) {
    const file = read(filePath)
    return template(file)({ evaluate })
}

const templateString = read('assets/template.html')
const pagePaths = fs.readdirSync(path.resolve(__dirname, src))

if (!fs.existsSync(dest)){
    fs.mkdirSync(dest)
}

for (let pagePath of pagePaths) {
    const content = evaluate(path.resolve(__dirname, src, pagePath))
    const page = template(templateString)({ content })
    fs.writeFileSync(path.resolve(__dirname, dest, pagePath), page)
}
